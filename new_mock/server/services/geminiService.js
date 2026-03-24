import { getGeminiModel } from "../config/googleAI.js";
import { extractJSON } from "../utils/aiParsers.js";
import axios from "axios";

/**
 * PRODUCTION-READY AI UTILITIES (GEMINI 1.5 FLASH)
 */

const withTimeout = (promise, ms = 20000) => {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout: AI did not respond within ${ms / 1000}s`)), ms)
  );
  return Promise.race([promise, timeout]);
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const withRetry = async (fn, retries = 2) => {
  let lastError;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < retries) {
        const waitSec = (i + 1) * 5; // 5s, 10s backoff
        console.warn(`⚠️ [AI SERVICE] Attempt ${i + 1} failed. Retrying in ${waitSec}s...`);
        await delay(waitSec * 1000);
      }
    }
  }
  throw lastError;
};

// ─── Automated Grok Fallback Interceptor ──────────────────────────────
async function executeGroqFallback(prompt) {
  const apiKey = process.env.GROK_API_KEY || process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("No GROK_API_KEY present in .env");

  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    },
    { headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" } }
  );
  return response.data.choices[0].message.content;
}

const executeWithFallback = async (prompt, timeoutMs = 15000) => {
  try {
    if (process.env.GROK_API_KEY || process.env.GROQ_API_KEY) {
      console.log("⚡ Executing Primary AI Engine (Groq Llama 3.3)...");
      const grokResult = await executeGroqFallback(prompt);
      return grokResult;
    } else {
      throw new Error("No Grok/Groq Key provided. Failing over to Google Gemini.");
    }
  } catch (grokError) {
    console.warn(`⚠️ Grok execution failed (${grokError.message}). Pivoting to Gemini load balancer...`);
    return await withRetry(async () => {
      const geminiModel = getGeminiModel();
      const result = await withTimeout(geminiModel.generateContent(prompt), timeoutMs);
      const response = await result.response;
      return response.text();
    });
  }
};

/**
 * GENERATE QUESTIONS (Production Prompt Engine)
 */
export const generateQuestions = async (
  roleOrContext,
  techStack,
  difficulty,
  type = "technical",
  count = 5,
  language = "English"
) => {
  const isContextMode = typeof roleOrContext === "object";
  const role = isContextMode ? roleOrContext.role : roleOrContext;
  const category = isContextMode ? roleOrContext.category : "white-collar";
  const experienceLevel = isContextMode ? roleOrContext.experienceLevel : difficulty;
  // Combine native DB skills with local tech stack chosen in UI
  const rawSkills = isContextMode ? roleOrContext.skills || [] : [];
  const skills = [techStack, ...rawSkills].filter(Boolean).join(", ") || "(Derive relevant tools/skills from the role itself)";
  const education = isContextMode ? roleOrContext.education : "Not specified";
  const workType = isContextMode ? roleOrContext.workType : "office";

  const prompt = `You are an expert interviewer for real-world jobs, especially blue-collar and skill-based roles.
Generate EXACTLY ${count} practical, conversational interview questions in strictly ${language}.

Context:
* Job Role: ${role}
* Category: ${category}
* Experience Level: ${experienceLevel}
* Skills: ${skills}
* Education: ${education}
* Work Type: ${workType}
* Interview Type: ${type}

Rules:
* If blue-collar:
  * Focus on real-life scenarios
  * Ask practical "how would you handle" questions
  * Avoid theory and jargon
* If low education:
  * Use simple language
* Keep tone conversational (spoken, not academic).
* Each question must be SHORT (max 20 words). ONE SENTENCE ONLY.
* If "Hindi": Use simple, conversational Hindi. Avoid complex words.
* If "Hinglish": Use a natural mix of Hindi and English.

Return ONLY a JSON array of ${count} questions. No markdown.
Example Output: ["Question 1", "Question 2"]
`;

  try {
    const rawResult = await executeWithFallback(prompt, 18000);
    const parsed = extractJSON(rawResult);


    if (!Array.isArray(parsed)) {
      throw new Error("AI returned non-array format");
    }

    return parsed.slice(0, count);

  } catch (err) {
    console.error("❌ [AI SERVICE] Question Generation Failed:", err.message);
    throw err;
  }
};

/**
 * EVALUATE INTERVIEW (Unified Structure)
 */
export const evaluateInterview = async (role, questions = [], answers = [], language = "English") => {
  const transcript = (questions || []).map((q, i) => ({
    question: q,
    answer: answers[i] || "Candidate provided no answer."
  }));

  const prompt = `Evaluate this ${language} interview transcript for a ${role} position.
  
  Transcript: ${JSON.stringify(transcript, null, 2)}
  
  RULES:
  1. Evaluate practical knowledge, communication clarity, confidence, safety awareness (if blue-collar), and problem-solving.
  2. Return ONLY a valid JSON object with exactly this structure properties:
     {
       "score": number (0-100),
       "strengths": ["string"],
       "weaknesses": ["string"],
       "suggestions": ["string"],
       "categoryBreakdown": {
         "communication": number,
         "practicalKnowledge": number,
         "confidence": number,
         "safety": number,
         "problemSolving": number
       },
       "questionFeedback": [
         {
           "question": "string",
           "rating": number (1-10),
           "comment": "string"
         }
       ],
       "finalAssessment": "string"
     }`;

  try {
    const rawResult = await executeWithFallback(prompt, 20000);
    const evaluation = extractJSON(rawResult);

    // 🛡️ Production Validation
    const required = ["score", "strengths", "weaknesses", "suggestions", "questionFeedback"];
    for (const field of required) {
      if (!evaluation[field]) throw new Error(`Missing ${field} in AI evaluation.`);
    }
    
    return evaluation;
  } catch (err) {
    console.error("❌ [AI SERVICE] Evaluation Failed:", err.message);
    throw err;
  }
};

/**
 * GENERATE NEXT QUESTION (Dynamic Conversational Flow)
 */
export const generateNextDynamicQuestion = async (role, transcript, language = "English") => {
  const lastInteraction = transcript[transcript.length - 1] || {};
  const currentQuestion = transcript[transcript.length - 2]?.content || "Intro";
  
  const prompt = `You are conducting a real-time interview in strictly ${language}.

Context:
* Role: ${role}

Current Question:
${currentQuestion}

Candidate Answer:
${lastInteraction.content || ""}

Instructions:
* If answer is weak → simplify or guide
* If answer is strong → ask deeper follow-up
* For blue-collar → focus on real situations
* Keep it short and conversational (max 2 sentences)

If you feel the interview has reached a natural conclusion after several questions, return ONLY the exact text: END_INTERVIEW
Otherwise, return the next question.

Respond ONLY with a valid JSON object in this format:
{
  "nextQuestion": "The generated string or END_INTERVIEW"
}`;

  try {
    const rawResult = await executeWithFallback(prompt, 15000);
    const parsed = extractJSON(rawResult);
    if (!parsed || !parsed.nextQuestion) throw new Error("Missing nextQuestion from AI");

    return parsed.nextQuestion;
  } catch (err) {
    console.error("❌ [AI SERVICE] Next Question Generation Failed:", err.message);
    throw err;
  }
};
