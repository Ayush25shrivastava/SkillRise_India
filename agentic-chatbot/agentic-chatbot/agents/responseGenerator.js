const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { ChatOpenAI } = require("@langchain/openai");
const cache = require("../utils/responseCache");
const path = require("path");

// ─── Load static datasets once at startup ─────────────────────────────────────
let coursesData = {};
let govSchemesData = [];
try {
  coursesData = require("../data/courses.json");
} catch (e) {
  console.warn("[ResponseGenerator] Could not load courses.json");
}
try {
  govSchemesData = require("../data/govSchemes.json");
} catch (e) {
  console.warn("[ResponseGenerator] Could not load govSchemes.json");
}

/**
 * Given a set of skill keywords, find matching courses from courses.json.
 * Matches against category names and course names (fuzzy/substring).
 * Returns up to maxResults unique courses as formatted Markdown link strings.
 */
function findMatchingCourses(keywords, maxResults = 6) {
  const normalizedKw = keywords.map(k => k.toLowerCase());
  const seen = new Map();

  // Broad keyword expansion for common terms
  const expanded = [...normalizedKw];
  if (normalizedKw.some(k => ["mern", "react", "node", "express", "mongodb", "web", "frontend", "backend"].some(t => k.includes(t)))) {
    expanded.push("web development", "software development");
  }
  if (normalizedKw.some(k => ["java", "dsa", "algorithm", "data structure", "coding"].some(t => k.includes(t)))) {
    expanded.push("software development", "other");
  }
  if (normalizedKw.some(k => ["ai", "ml", "machine learning", "deep learning"].some(t => k.includes(t)))) {
    expanded.push("ai", "data science");
  }
  if (normalizedKw.some(k => ["cloud", "aws", "devops", "docker", "kubernetes"].some(t => k.includes(t)))) {
    expanded.push("cloud computing", "software development");
  }

  for (const [categoryName, courses] of Object.entries(coursesData)) {
    const catLower = categoryName.toLowerCase();
    const isMatch = expanded.some(kw => catLower.includes(kw) || kw.includes(catLower));
    if (isMatch && Array.isArray(courses)) {
      for (const course of courses) {
        if (course && course.name && course.link && !seen.has(course.link)) {
          seen.set(course.link, course);
        }
        if (seen.size >= maxResults) break;
      }
    }
    if (seen.size >= maxResults) break;
  }

  // Fallback: if nothing matched, grab from "Software Development" or first category
  if (seen.size === 0) {
    const fallbackCategory = coursesData["Software Development"] || coursesData["Other"] || Object.values(coursesData)[0] || [];
    for (const course of fallbackCategory) {
      if (course && course.name && course.link && !seen.has(course.link)) {
        seen.set(course.link, course);
      }
      if (seen.size >= maxResults) break;
    }
  }

  return Array.from(seen.values())
    .slice(0, maxResults)
    .map(c => `- [${c.name}](${c.link}) — *${c.provider}*`);
}

/**
 * Given a set of skill keywords, find matching government schemes from govSchemes.json.
 * Returns up to maxResults unique schemes as formatted Markdown link strings.
 */
function findMatchingSchemes(keywords, maxResults = 5) {
  const normalizedKw = keywords.map(k => k.toLowerCase());
  const seen = new Map();

  // Broad keyword expansion
  const expanded = [...normalizedKw];
  if (normalizedKw.some(k => ["mern", "react", "node", "express", "web", "frontend", "backend", "javascript"].some(t => k.includes(t)))) {
    expanded.push("web development", "react", "node.js");
  }
  if (normalizedKw.some(k => ["java", "dsa", "algorithm", "data structure", "software", "swe", "engineer"].some(t => k.includes(t)))) {
    expanded.push("java", "sql", "git");
  }
  if (normalizedKw.some(k => ["ai", "ml", "machine learning", "deep learning"].some(t => k.includes(t)))) {
    expanded.push("machine learning", "deep learning", "ai");
  }
  if (normalizedKw.some(k => ["cloud", "aws", "devops"].some(t => k.includes(t)))) {
    expanded.push("cloud computing", "kubernetes");
  }

  for (const entry of govSchemesData) {
    const required = (entry.required_skills || []).map(s => s.toLowerCase());
    const matches = expanded.some(kw => required.some(r => r.includes(kw) || kw.includes(r)));
    if (matches && Array.isArray(entry.recommended_government_schemes)) {
      for (const scheme of entry.recommended_government_schemes) {
        if (scheme && scheme.name && scheme.link) {
          const key = scheme.name + scheme.link;
          if (!seen.has(key)) seen.set(key, scheme);
        }
        if (seen.size >= maxResults) break;
      }
    }
    if (seen.size >= maxResults) break;
  }

  return Array.from(seen.values())
    .slice(0, maxResults)
    .map(s => `- [${s.name}](${s.link}) — *${s.provider}*`);
}

/**
 * Extract skill keywords from a user query string.
 * Also incorporates skills already known from state (routerAgent extraction or userProfile).
 */
function extractKeywordsFromQuery(query, knownSkills = []) {
  const techTerms = [
    "java", "python", "javascript", "typescript", "c++", "c#", "go", "rust", "kotlin", "swift",
    "react", "node", "express", "mongodb", "mysql", "postgresql", "sql", "nosql",
    "mern", "mean", "next.js", "vue", "angular",
    "machine learning", "ml", "deep learning", "ai", "nlp", "data science", "data analysis",
    "cloud", "aws", "azure", "gcp", "devops", "docker", "kubernetes",
    "dsa", "algorithms", "data structures", "leetcode", "competitive programming",
    "system design", "microservices", "api", "rest", "graphql",
    "software engineer", "swe", "backend", "frontend", "fullstack", "full stack",
    "android", "ios", "mobile", "flutter",
    "cybersecurity", "blockchain", "web development"
  ];

  const queryLower = query.toLowerCase();
  const found = techTerms.filter(term => queryLower.includes(term));
  const combined = [...new Set([...found, ...knownSkills.map(s => s.toLowerCase())])];
  return combined.length > 0 ? combined : ["software development"];
}

/**
 * Response Generator Node for LangGraph
 * Converts structured agent outputs into a human-friendly, markdown-formatted response.
 * Always injects relevant courses and government schemes from local datasets.
 */
async function responseGenerator(state) {
  console.log("--- RESPONSE GENERATOR EXECUTION ---");

  try {
    const finalResponseData = state.finalResponse || {};
    const userQuery = state.userQuery || "";
    const chatHistory = state.chatHistory || [];
    const userProfile = state.userProfile || null;
    const hasStructuredData = Object.keys(finalResponseData).length > 0;

    // Build retrieved data context string for prompt injection
    const retrievedData = state.retrievedData || {};
    const hasRetrievedData = Object.keys(retrievedData).length > 0;
    let retrievedDataSection = "";
    if (hasRetrievedData) {
      const sections = [];
      for (const [dataset, entries] of Object.entries(retrievedData)) {
        if (Array.isArray(entries) && entries.length > 0) {
          sections.push(`${dataset}: ${entries.map(e => e.content || e.name || JSON.stringify(e)).join(" | ")}`);
        }
      }
      if (sections.length > 0) {
        retrievedDataSection = `\n## Retrieved Context from Real Databases (use for grounding — do NOT invent data)\n${sections.join("\n")}\n`;
      }
    }

    // Build user profile string
    let userProfileStr = "Not provided";
    if (userProfile) {
      const { education, skills, interest } = userProfile;
      userProfileStr = `* Education: ${education || 'Not specified'}\n* Known skills: ${skills || 'Not specified'}\n* Career interest: ${interest || 'Not specified'}`;
    }

    // ─── Extract keywords to look up courses/schemes ──────────────────────────
    // Pull known skills from state (routerAgent may have set these) or from structured data
    const stateSkills = state.data?.userSkills || state.userSkills || 
                        finalResponseData.skillAnalysis?.userSkills || 
                        finalResponseData.careerRecommendations?.[0]?.requiredSkills || [];
    const keywords = extractKeywordsFromQuery(userQuery, stateSkills);
    console.log(`[ResponseGenerator] Resolved keywords for resource lookup: ${keywords.join(', ')}`);

    // ─── Fetch relevant courses and schemes from local datasets ───────────────
    const matchedCourses = findMatchingCourses(keywords);
    const matchedSchemes = findMatchingSchemes(keywords);

    const coursesSection = matchedCourses.length > 0
      ? matchedCourses.join("\n")
      : "- [NPTEL Programming in Java](https://nptel.ac.in/courses/106105191) — *NPTEL*\n- [Skill India Web Developer](https://www.skillindiadigital.gov.in) — *Skill India*";

    const schemesSection = matchedSchemes.length > 0
      ? matchedSchemes.join("\n")
      : "- [FutureSkills Prime](https://futureskillsprime.in/) — *NASSCOM*\n- [Skill India Digital](https://www.skillindiadigital.gov.in/) — *Skill India*";

    // ─── Cache check ───────────────────────────────────────────────────────
    const cacheKey = cache.hash(`response:${userQuery}:${JSON.stringify(finalResponseData)}:${JSON.stringify(userProfile)}`);
    if (cache.has(cacheKey)) {
      console.log("[ResponseGenerator] Returning cached conversational response.");
      return { conversationalResponse: cache.get(cacheKey) };
    }

    // ─── Build the full prompt ────────────────────────────────────────────────
    const prompt = `
You are an AI career assistant designed to help students with career guidance, skills, roadmaps, and project ideas.

## Response Format (MANDATORY — follow exactly)

Your response MUST use these exact markdown headings (H2 = ##, H3 = ###):

## 1. Quick Answer
*(1–3 sentences acknowledging the user's goal)*

## 2. Roadmap
### Step 1: [Title]
- bullet points

### Step 2: [Title]
- bullet points

*(and so on — use clear numbered steps)*

## 3. Courses & Government Schemes
*(You MUST list ALL courses and schemes provided below as clickable markdown links. Do NOT skip any. Format: [Name](URL))*

## 4. Suggested Projects
- bullet list of 2–3 project ideas relevant to the user's goal

## 5. Timeline
*(Realistic week-by-week or month-by-month plan)*

---

## Formatting Rules
- Use markdown headings (##, ###) — REQUIRED
- Use bullet points, NOT paragraphs
- Keep all explanations short and actionable
- Do NOT write any prose paragraphs — only bullets and headings
- Every course and scheme MUST appear as a formatted link: [Name](URL)
- Do NOT invent courses or schemes — ONLY use the ones provided below
- Start directly with ## 1. Quick Answer — no preamble

---
${hasStructuredData ? `
## Structured Backend Data (use this to personalize the roadmap):
\`\`\`json
${JSON.stringify(finalResponseData, null, 2)}
\`\`\`
` : ""}
${retrievedDataSection}

## User Profile
${userProfileStr}

## Relevant Conversation History  
${chatHistory.slice(-4).map(m => `[${m.role}]: ${m.content?.slice(0, 300)}`).join("\n") || "No previous context"}

## User Question
${userQuery || "Please build me a personalized career roadmap."}

---

## Courses to Include (MANDATORY — list ALL of these as clickable links in ## 3):

${coursesSection}

## Government Schemes to Include (MANDATORY — list ALL of these as clickable links in ## 3):

${schemesSection}

---

Now generate the complete structured response following the format above exactly. Start immediately with ## 1. Quick Answer.
`;

    let responseContent;

    // ─── Primary: Gemini 2.5-flash ───────────────────────────────────────────
    try {
      console.log("[ResponseGenerator] Calling Gemini (primary)...");
      const geminiLlm = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
        apiKey: process.env.GOOGLE_API_KEY,
        temperature: 0.3,
        maxRetries: 1
      });
      const response = await geminiLlm.invoke(prompt);
      responseContent = response.content;
      console.log("[ResponseGenerator] Gemini response generated.");
    } catch (geminiErr) {
      console.warn(`[ResponseGenerator] Gemini failed (${geminiErr.message}). Falling back to Groq...`);

      // ─── Fallback: Groq ───────────────────────────────────────────────────
      const groqLlm = new ChatOpenAI({
        model: "llama-3.3-70b-versatile",
        apiKey: process.env.GROK_API_KEY,
        configuration: { baseURL: "https://api.groq.com/openai/v1" },
        temperature: 0.3,
        maxRetries: 1
      });
      const response = await groqLlm.invoke(prompt);
      responseContent = response.content;
      console.log("[ResponseGenerator] Groq fallback response generated.");
    }

    cache.set(cacheKey, responseContent, cache.TTL.RESPONSE);
    return { conversationalResponse: responseContent };

  } catch (error) {
    console.error("[ResponseGenerator] Error:", error.message);
    return {
      conversationalResponse: "I'm sorry, I encountered an issue processing your request. Please try again in a moment."
    };
  }
}

module.exports = responseGenerator;
