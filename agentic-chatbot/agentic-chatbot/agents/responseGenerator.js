const { createLLM } = require("../utils/llmFactory");
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

  for (const course of coursesData) {
    if (!course || !course.name || !course.link) continue;
    
    // Check if course matches any keyword via its tags, name, or roles
    const searchString = `${course.name} ${(course.tags || []).join(" ")} ${(course.roles || []).join(" ")}`.toLowerCase();
    const isMatch = expanded.some(kw => searchString.includes(kw));
    
    if (isMatch && !seen.has(course.link)) {
      seen.set(course.link, course);
    }
    if (seen.size >= maxResults) break;
  }

  // Fallback: if nothing matched, just grab the first few courses
  if (seen.size === 0) {
    for (const course of coursesData) {
      if (!course || !course.name || !course.link) continue;
      if (!seen.has(course.link)) {
        seen.set(course.link, course);
      }
      if (seen.size >= maxResults) break;
    }
  }

  return Array.from(seen.values())
    .slice(0, maxResults)
    .map(c => `- [${c.name}](${c.link})`);
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

  for (const scheme of govSchemesData) {
    if (!scheme || !scheme.name || !scheme.link) continue;
    
    // Check if scheme matches any keyword via its tags, roles, or skills
    const schemeSkills = scheme.supports?.skills || [];
    const schemeRoles = scheme.supports?.roles || [];
    const searchString = `${scheme.name} ${(scheme.tags || []).join(" ")} ${schemeSkills.join(" ")} ${schemeRoles.join(" ")}`.toLowerCase();
    
    const isMatch = expanded.some(kw => searchString.includes(kw));
    
    if (isMatch) {
      const key = scheme.name + scheme.link;
      if (!seen.has(key)) seen.set(key, scheme);
    }
    if (seen.size >= maxResults) break;
  }

  // Fallback if no specific topic match
  if (seen.size === 0) {
    for (const scheme of govSchemesData) {
      if (!scheme || !scheme.name || !scheme.link) continue;
      const key = scheme.name + scheme.link;
      if (!seen.has(key)) seen.set(key, scheme);
      if (seen.size >= maxResults) break;
    }
  }

  return Array.from(seen.values())
    .slice(0, maxResults)
    .map(s => `- [${s.name}](${s.link})`);
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

  const queryLower = (query || "").toLowerCase();
  const found = techTerms.filter(term => queryLower.includes(term));
  const combined = [...new Set([...found, ...(knownSkills || []).filter(Boolean).map(s => String(s).toLowerCase())])];
  return combined.length > 0 ? combined : ["software development"];
}

// ═══════════════════════════════════════════════════════════════════════════════
// Helper: Determine user experience level from userContext
// ═══════════════════════════════════════════════════════════════════════════════
function assessUserLevel(userContext) {
  const experience = userContext.experience || [];
  const skills = userContext.skills || [];
  const education = userContext.education || [];

  // Experience-based heuristic
  if (experience.length >= 3 || skills.length >= 10) return "advanced";
  if (experience.length >= 1 || skills.length >= 5 || education.length >= 1) return "intermediate";
  return "beginner";
}

// ═══════════════════════════════════════════════════════════════════════════════
// Helper: Compute confidence level from aggregated data
// ═══════════════════════════════════════════════════════════════════════════════
function computeConfidence(finalResponseData) {
  const matchPct = finalResponseData.skillAnalysis?.matchPercentage;
  const hasCareer = (finalResponseData.careerRecommendations || []).length > 0;
  const hasRoadmap = finalResponseData.roadmap && finalResponseData.roadmap.length > 0;

  if (matchPct != null) {
    if (matchPct >= 70 && hasCareer) return "High";
    if (matchPct >= 40) return "Medium";
    return "Low";
  }

  // Fallback when matchPercentage is not computed
  if (hasCareer && hasRoadmap) return "Medium";
  return "Low";
}

/**
 * Response Generator Node for LangGraph
 * Converts structured agent outputs into a deeply personalized, markdown-formatted response.
 * Uses full userContext, userProfile, retrievedData, and aggregated agent outputs.
 * Always injects relevant courses and government schemes from local datasets.
 *
 * UPGRADED: Now includes dynamic personalization, confidence scoring, decision-explaining,
 * and an expanded 10-section output structure.
 */
async function responseGenerator(state) {
  console.log("--- RESPONSE GENERATOR EXECUTION ---");

  try {
    const finalResponseData = state.finalResponse || {};
    const userQuery = state.userQuery || "";
    const chatHistory = state.chatHistory || [];
    const userProfile = state.userProfile || null;
    const userContext = state.userContext || {};
    const retrievedData = state.retrievedData || {};
    const hasStructuredData = Object.keys(finalResponseData).length > 0;

    // ─── Compute dynamic personalization signals ────────────────────────────
    const userLevel = assessUserLevel(userContext);
    const confidence = computeConfidence(finalResponseData);
    console.log(`[ResponseGenerator] User Level: ${userLevel}, Confidence: ${confidence}`);

    // ─── Build retrieved data context string for prompt injection ────────────
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

    // ─── Build user profile string ──────────────────────────────────────────
    let userProfileStr = "Not provided";
    if (userProfile) {
      const { education, skills, interest } = userProfile;
      userProfileStr = `* Education: ${education || 'Not specified'}\n* Known skills: ${skills || 'Not specified'}\n* Career interest: ${interest || 'Not specified'}`;
    }

    // ─── Build full user context string ─────────────────────────────────────
    const userContextStr = Object.keys(userContext).length > 0
      ? JSON.stringify(userContext, null, 2)
      : "Not available — rely on resume data and query.";

    // ─── Extract keywords to look up courses/schemes ────────────────────────
    const stateSkills = userContext.skills || state.data?.userSkills || state.userSkills || 
                        finalResponseData.skillAnalysis?.userSkills || 
                        finalResponseData.careerRecommendations?.[0]?.requiredSkills || [];
    const keywords = extractKeywordsFromQuery(userQuery, stateSkills);
    console.log(`[ResponseGenerator] Resolved keywords for resource lookup: ${keywords.join(', ')}`);

    // ─── Fetch relevant courses and schemes from local datasets ─────────────
    const matchedCourses = findMatchingCourses(keywords);
    const matchedSchemes = findMatchingSchemes(keywords);

    const coursesSection = matchedCourses.length > 0
      ? matchedCourses.join("\n")
      : "- [NPTEL Programming in Java](https://nptel.ac.in/courses/106105191) — *NPTEL*\n- [Skill India Web Developer](https://www.skillindiadigital.gov.in) — *Skill India*";

    const schemesSection = matchedSchemes.length > 0
      ? matchedSchemes.join("\n")
      : "- [FutureSkills Prime](https://futureskillsprime.in/) — *NASSCOM*\n- [Skill India Digital](https://www.skillindiadigital.gov.in/) — *Skill India*";

    // ─── Dynamic personalization instructions ───────────────────────────────
    let personalizationDirective = "";
    if (userLevel === "advanced") {
      personalizationDirective = `
DYNAMIC PERSONALIZATION:
- This user is ADVANCED (has significant experience and skills).
- Skip beginner-level steps in the roadmap.
- Recommend senior/lead-level roles and advanced specializations.
- Suggest system design, architecture, or leadership projects.
- Roadmap should be concise — focus on gaps only.`;
    } else if (userLevel === "intermediate") {
      personalizationDirective = `
DYNAMIC PERSONALIZATION:
- This user is INTERMEDIATE (has some experience and a moderate skill set).
- Include intermediate-to-advanced steps in the roadmap.
- Recommend mid-level roles that stretch their abilities.
- Projects should be portfolio-worthy and practical.
- Timeline should be realistic (2–4 months).`;
    } else {
      personalizationDirective = `
DYNAMIC PERSONALIZATION:
- This user is a BEGINNER (little to no experience).
- Simplify the roadmap — start with fundamentals.
- Recommend entry-level or internship positions.
- Projects should be learning-oriented and achievable.
- Timeline should be generous (3–6 months).
- Provide extra encouragement and clarity.`;
    }

    // ─── Edge case handling instructions ────────────────────────────────────
    let edgeCaseNote = "";
    if (!hasRetrievedData && !userProfile && !Object.keys(userContext).length) {
      edgeCaseNote = `
EDGE CASE: No retrieved data, no user profile, and no resume available.
- Use your general knowledge to answer the user's query.
- Be transparent that recommendations are general and not personalized.
- Encourage the user to upload a resume or fill out their profile for better results.`;
    } else if (!hasRetrievedData) {
      edgeCaseNote = `
EDGE CASE: No retrieved data from knowledge base available.
- Rely on user profile and resume data for personalization.
- Use your general knowledge to fill gaps, but be transparent about it.`;
    } else if (!userProfile && Object.keys(userContext).length === 0) {
      edgeCaseNote = `
EDGE CASE: No user profile or resume data available.
- Rely on retrieved knowledge base data and the user's query.
- Ask the user to provide more details for better personalization.`;
    }

    // ─── Cache check ────────────────────────────────────────────────────────
    const cacheKey = cache.hash(`response:${userQuery}:${JSON.stringify(finalResponseData)}:${JSON.stringify(userProfile)}:${userLevel}`);
    if (cache.has(cacheKey)) {
      console.log("[ResponseGenerator] Returning cached conversational response.");
      return { conversationalResponse: cache.get(cacheKey) };
    }

    // ═════════════════════════════════════════════════════════════════════════
    // BUILD THE FULL PROMPT — deeply personalized, context-aware
    // ═════════════════════════════════════════════════════════════════════════
    const prompt = `
You are an expert AI career assistant designed to deliver deeply personalized, actionable career guidance.

You have access to the user's FULL CONTEXT — use it all. Never give generic advice.

---

## Response Format (MANDATORY — follow exactly)

Your response MUST use these exact markdown headings (H2 = ##, H3 = ###):

## 1. Quick Answer
*(1–3 sentences directly addressing the user's goal. Be specific — reference their skills/experience.)*

## 2. Why This Fits You
*(Explain your reasoning based on:)*
- The user's existing skills and experience level
- Retrieved data from the knowledge base
- How the recommendation aligns with their goals
- What makes this realistic for their current level — do NOT suggest overqualified roles

## 3. Recommended Career / Direction
*(Top 1–2 career options with a brief justification for each. Reference actual data where available.)*

## 4. Skill Gap Analysis
*(Split into two clear subsections:)*
### What You Already Have
- bullet list of existing skills that match
### What You Need to Learn
- bullet list of missing skills, in priority order

## 5. Roadmap
### Step 1: [Title]
- bullet points
### Step 2: [Title]
- bullet points
### Step 3: [Title]
- bullet points
*(Use as many steps as necessary — be specific, not vague)*

## 6. Courses & Government Schemes
*(You MUST list ALL courses and schemes provided below as clickable markdown links. Do NOT skip any. Format: [Name](URL))*

## 7. Suggested Projects
- 2–3 relevant project ideas that match the user's level and target role
- Each should be clearly achievable as a portfolio piece

## 8. Timeline
*(Realistic week-by-week or month-by-month plan tailored to the user's experience level)*

## 9. Next Steps
*(3–5 concrete, immediately actionable tasks the user can start today)*

## 10. Confidence Level
*(State: High / Medium / Low based on skill match quality)*
Current Assessment: **${confidence}** (Skill match: ${finalResponseData.skillAnalysis?.matchPercentage ?? 'N/A'}%)

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

## PERSONALIZATION RULES (CRITICAL — follow strictly)

- Tailor ALL recommendations based on:
  - user skills (from resume + profile)
  - education level
  - years of experience
  - stated goals and interests
- Prefer REALISTIC roles — avoid suggesting overqualified positions
- Use retrieved data as the PRIMARY source of truth
- Avoid generic advice — every bullet should reference something specific about this user
- Explain WHY each recommendation fits this specific user
- Highlight skill gaps clearly with priority ordering
- Compare multiple options when appropriate

${personalizationDirective}

${edgeCaseNote}

---
${hasStructuredData ? `
## Aggregated Agent Data (use this to personalize everything):
\`\`\`json
${JSON.stringify(finalResponseData, null, 2)}
\`\`\`
` : ""}

## User Context (skills, education, experience, goals):
\`\`\`json
${userContextStr}
\`\`\`

## Raw User Profile:
${userProfileStr}

## Retrieved Knowledge (from Pinecone — use for grounding, do NOT invent):
${retrievedDataSection || "No retrieved data available — use general knowledge with transparency."}

## Relevant Conversation History  
${chatHistory.slice(-4).map(m => `[${m.role}]: ${m.content?.slice(0, 300)}`).join("\n") || "No previous context"}

## User Question
${userQuery || "Please build me a personalized career roadmap."}

---

## Courses to Include (MANDATORY — list ALL of these as clickable links in ## 6):

${coursesSection}

## Government Schemes to Include (MANDATORY — list ALL of these as clickable links in ## 6):

${schemesSection}

---

Now generate the complete structured response following the format above exactly. Start immediately with ## 1. Quick Answer.
`;

    let responseContent;

    // ─── LLM Call (round-robin Gemini + automatic Grok fallback) ─────────────
    try {
      console.log("[ResponseGenerator] Calling LLM (round-robin + fallback)...");
      const llm = createLLM({ temperature: 0.3, caller: "responseGenerator" });
      const response = await llm.invoke(prompt);
      responseContent = response.content;
      console.log("[ResponseGenerator] LLM response generated.");
    } catch (llmErr) {
      console.error(`[ResponseGenerator] All LLMs failed: ${llmErr.message}`);
      throw llmErr;
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
