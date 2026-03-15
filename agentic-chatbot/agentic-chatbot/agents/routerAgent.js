// Router Agent
// PRIMARY: Groq (llama-3.3-70b) — fast classification, no latency overhead
// FALLBACK: Safe hardcoded default (careerAgent) — Gemini NOT used here (save quota)
// CACHE: 2-minute TTL on routing decisions for identical queries

const { ChatOpenAI } = require("@langchain/openai");
const routerPrompt = require("../prompts/routerPrompt");
const { z } = require("zod");
const cache = require("../utils/responseCache");

const routerSchema = z.object({
  agents: z.array(z.enum(["resumeAgent", "careerAgent", "skillAgent", "schemeAgent", "roadMapAgent", "chitchat"])).describe("List of agents to call"),
  extractedSkills: z.array(z.string()).optional().describe("Technical or soft skills mentioned by the user"),
  targetRole: z.string().optional().describe("Target job role or career goal mentioned by the user")
});

/**
 * Router Agent — Groq Primary, Gemini Fallback
 */
async function routerAgent(state) {
  console.log("--- ROUTER AGENT EXECUTION ---");

  const query = state.userQuery || "";

  // Default routing when no query and no resume
  if (!query.trim() && !state.resumeFilePath) {
    console.warn("[RouterAgent] No query — defaulting to careerAgent.");
    return { selectedAgents: ["careerAgent"] };
  }

  // Build prompt with conversation history
  let historyText = "";
  if (state.chatHistory && state.chatHistory.length > 0) {
    historyText = "Conversation History:\n" + state.chatHistory.slice(-5)
      .map(msg => `[${msg.role}]: ${msg.content}`)
      .join("\n") + "\n\n";
  }
  const promptText = routerPrompt + "\n" + historyText + "User's Final Query: " + query;

  // ─── Cache check ─────────────────────────────────────────────────────────────
  const cacheKey = cache.hash(promptText);
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    console.log("[RouterAgent] Returning cached routing decision.");
    return buildRouterOutput(cached, state);
  }

  try {
    let rawResponse;

    try {
      console.log("[RouterAgent] Calling Gemini (primary)...");
      const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
      const geminiLlm = new ChatGoogleGenerativeAI({
        modelName: "gemini-2.5-flash",
        apiKey: process.env.GOOGLE_API_KEY,
        temperature: 0,
      });
      const structuredGemini = geminiLlm.withStructuredOutput(routerSchema, { name: "router" });
      rawResponse = await structuredGemini.invoke(promptText);
      console.log("[RouterAgent] Gemini routing succeeded.");
    } catch (geminiErr) {
      console.warn(`[RouterAgent] Gemini failed (${geminiErr.message}). Using safe default routing.`);
      // Robust Regex Fallback
      let fallbackAgents = state.resumeFilePath ? ["resumeAgent", "careerAgent", "skillAgent"] : ["careerAgent", "skillAgent"];
      if (query.toLowerCase().includes("scheme") || query.toLowerCase().includes("government") || query.toLowerCase().includes("gov")) {
         fallbackAgents.push("schemeAgent");
      }
      if (query.toLowerCase().includes("roadmap") || query.toLowerCase().includes("road map")) {
         fallbackAgents.push("roadMapAgent");
      }
      rawResponse = {
        agents: Array.from(new Set(fallbackAgents)),
        extractedSkills: [],
        targetRole: null
      };
    }

    // Cache the raw routing response
    cache.set(cacheKey, rawResponse, cache.TTL.ROUTER);

    return buildRouterOutput(rawResponse, state);

  } catch (error) {
    console.error(`[RouterAgent] Both LLMs failed: ${error.message}`);
    return { selectedAgents: ["careerAgent"] };
  }
}

function buildRouterOutput(rawResponse, state) {
  let agents = rawResponse.agents || [];

  // Always inject resumeAgent if a resume file is uploaded
  if (state.resumeFilePath && !agents.includes("resumeAgent")) {
    console.log("[RouterAgent] Auto-injecting resumeAgent (resume detected).");
    agents = [...new Set([...agents, "resumeAgent", "skillAgent", "careerAgent"])];
  }

  // Filter to valid agent pool
  const validAgents = ["resumeAgent", "careerAgent", "skillAgent", "schemeAgent", "roadMapAgent", "chitchat"];
  agents = agents.filter(a => validAgents.includes(a));
  if (agents.length === 0) agents = ["careerAgent"];

  console.log(`[RouterAgent] Selected agents: ${agents.join(", ")}`);

  const outputData = {};
  if (!state.resumeFilePath && rawResponse.extractedSkills?.length > 0) {
    outputData.userSkills = rawResponse.extractedSkills;
    console.log(`[RouterAgent] Extracted skills: ${rawResponse.extractedSkills.join(", ")}`);
  }
  if (rawResponse.targetRole) {
    outputData.targetRole = rawResponse.targetRole;
  }

  return { selectedAgents: agents, data: outputData };
}

module.exports = routerAgent;
