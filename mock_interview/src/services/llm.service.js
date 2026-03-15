// src/services/llm.service.js
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { extractJSON } from "../utils/extractJSON.js";
import dotenv from "dotenv";

dotenv.config();

// ── Model instantiation ──────────────────────────────────────────────
const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.7,
});

const parser = new StringOutputParser();

// ── Chain factory ────────────────────────────────────────────────
function buildChain(templateString) {
    const prompt = PromptTemplate.fromTemplate(templateString);
    return prompt.pipe(llm).pipe(parser);
}

// ── 1. Question generation ───────────────────────────────────────
const questionChain = buildChain(`
You are a friendly technical interviewer. Generate ONE specific {difficulty} {category} question based on these skills: {skills}.
Context: Role: {role}, Level: {level}.

Language Rules:
- Use simple, plain English (no SAT words or overly academic phrasing).
- Sound like a human engineer chatting, not a standardized test.
- Be direct and clear.

Question Variation Rules:
- Category {category} implies:
  * Concept: How something works in simple terms.
  * Implementation: How you would actually write or use it.
  * Debugging: How you'd fix a common mistake.
  * Optimization: How you'd make it faster or better.

Difficulty Rules:
- Beginner: Basic syntax and "how-to" questions.
- Intermediate: Practical "real-world" scenario or logic.
- Advanced: Architectural trade-offs or complex internals.

Constraints:
1. Strictly under 30 words.
2. Focus on exactly one concept.
3. Don't repeat concepts from this list: {previousQuestions}.
4. Output ONLY the question text.
`);

// ── 2. Follow-up Question generation ──────────────────────────────
const followUpChain = buildChain(`
You are a friendly technical colleague. The candidate just gave an answer that needs a bit more detail.
Ask a clear, simple follow-up to help them explain the tricky parts of their last answer.

Role: {role}
Level: {level}
Question: {question}
Candidate's Answer: {answer}
Feedback: {feedback}

Rules:
1. Use natural, conversational English. No corporate jargon.
2. Focus on digging into that one specific thing they missed or explained vaguely.
3. Don't repeat the original question.
4. Output ONLY the follow-up question text.
`);

// ── 3. Answer evaluation ─────────────────────────────────────────
const evaluationChain = buildChain(`
Evaluate the user's answer for a technical interview.
Role: {role}
Level: {level}
Question: {question}
Answer: {answer}

Return a JSON object containing:
- score: An object with "technical", "clarity", "communication", "logic", and "overall" (each 1-10).
- feedback: A brief critique of the answer (for the final report).
- conversationalResponse: A supportive, professional, and encouraging 1-sentence response that acknowledges their answer without giving away the score or technical critique (e.g., "That's a solid explanation of the concept, let's keep going!").
- improvedAnswer: A better version of the answer.
- isFollowUpNeeded: Boolean. True if the answer was incomplete or partially correct and deserves a follow-up.

Output ONLY valid JSON.
`);

// ── 4. Final report ──────────────────────────────────────────────
const reportChain = buildChain(`
Analyze the technical interview transcript and generate a structured final Dossier.
Role: {role}, Level: {level}

Transcript Data:
{transcript}

Return a JSON object containing:
- overallScore: Average performance score (1-100).
- strengths: Top 3 technical/behavioral strengths.
- weaknesses: Top 3 architectural or knowledge gaps.
- suggestedTopics: Future learning recommendations.
- questionAnalysis: An array of objects, each containing:
    * question: The question text.
    * answer: The candidate's original answer.
    * score: The overall score for that answer.
    * feedback: The critique for that answer.
    * betterAnswer: The model's ideal answer.

Output ONLY valid JSON.
`);

// ── Exported invoke functions ────────────────────────────────────

export async function generateQuestion({ role, level, skills, category, difficulty, questionNumber, previousQuestions }) {
    try {
        console.log("Invoking questionChain...");
        const res = await questionChain.invoke({
            role,
            level,
            category: category || "Concept",
            difficulty: difficulty || "standard",
            skills: Array.isArray(skills) ? skills.join(", ") : skills,
            questionNumber: String(questionNumber),
            previousQuestions: previousQuestions.length ? previousQuestions.join(", ") : "None",
        });
        console.log("questionChain result:", res);
        return res;
    } catch(e) {
        console.error("Error in generateQuestion:", e);
        throw e;
    }
}

export async function generateFollowUp({ role, level, question, answer, feedback }) {
    return followUpChain.invoke({
        role,
        level,
        question,
        answer,
        feedback,
    });
}

export async function evaluateAnswer({ role, level, question, answer }) {
    const raw = await evaluationChain.invoke({ role, level, question, answer });
    return extractJSON(raw);
}

export async function generateFinalReport({ role, level, history }) {
    // 1. Calculate Skill Scores from history
    const skillMap = {};
    history.forEach(h => {
        if (!h.skill) return;
        if (!skillMap[h.skill]) skillMap[h.skill] = [];
        skillMap[h.skill].push(h.evaluation.score?.overall || 0);
    });

    const skillScores = {};
    Object.keys(skillMap).forEach(skill => {
        const scores = skillMap[skill];
        skillScores[skill] = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    });

    // 2. Build Transcript for LLM (Focus on quality, not raw JSON)
    const transcript = history
        .map(
            (h, i) =>
                `Q${i + 1} (${h.skill}): ${h.question}\nAnswer: ${h.answer}\nScore: ${h.evaluation.score?.overall || 0}/10\nEvaluation: ${h.evaluation.feedback}`
        )
        .join("\n\n");

    const raw = await reportChain.invoke({ role, level, transcript });
    const report = extractJSON(raw);

    // 3. Return report with merged skill scores
    return {
        ...report,
        skillScores
    };
}