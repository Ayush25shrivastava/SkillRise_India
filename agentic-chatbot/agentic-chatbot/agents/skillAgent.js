// Skill Agent
// Handles skill assessment and recommendations by interacting with the skillMatcher tool
// and updating the LangGraph state.
// UPGRADED: Refines skill matching with full profile and retrieved data through LLM reasoning.

const { matchSkills } = require('../mcp-tools/skillMatcher');
const { createLLM } = require("../utils/llmFactory");
const getAgentPrompt = require("../prompts/agentPrompt");

/**
 * Skill Agent Node for LangGraph
 * Passes centralized retrievedData into skillMatcher to avoid redundant Pinecone queries.
 * Refines the tool output using profile-aware full context LLM.
 * 
 * @param {Object} state - The current state of the LangGraph workflow
 * @returns {Object} State updates with strict JSON
 */
const skillAgent = async (state) => {
  console.log("--- SKILL AGENT EXECUTION ---");
  
  try {
    const userSkills = state.userContext?.skills || state.data?.userSkills || [];
    const targetRole = state.userContext?.targetRole || state.data?.targetRole || null;
    
    console.log(`[SkillAgent] Analyzing skills... Target Role preference: ${targetRole || 'Not specified'}`);

    if (!userSkills || userSkills.length === 0) {
      console.warn("[SkillAgent] Warning: No user skills found.");
      return {
        status: "error",
        error: {
          agent: "skillAgent",
          message: "User skills missing"
        }
      };
    }

    // Extract centralized retrieved context (merge jobs + skills for richer context)
    const retrievedJobs = state.retrievedData?.jobs || [];
    const retrievedSkills = state.retrievedData?.skills || [];
    const externalContext = [...retrievedJobs, ...retrievedSkills];

    // Pass external context into skillMatcher — tool will skip its own Pinecone query
    const matcherResult = await matchSkills(userSkills, externalContext.length > 0 ? externalContext : null);

    if (matcherResult && matcherResult.status === "error") {
      return {
        status: "error",
        error: {
          agent: "skillAgent",
          message: matcherResult.message
        }
      };
    }

    console.log("[SkillAgent] Skill gap analysis tool run completed.");
    
    const analysisData = matcherResult?.data?.analysis || {};
    const vectorMatches = matcherResult?.data?.vectorMatches || [];

    const toolOutput = {
      skillAnalysis: analysisData,
      vectorMatches: vectorMatches,
      targetRole: targetRole || analysisData.targetRole || "Unknown Role"
    };

    // ─── Step 2: LLM Reasoning Layer with FULL CONTEXT ────────────────────
    try {
      console.log(`[SkillAgent] Running full personalization reasoning layer...`);

      const agentSpecificTask = `
Your specific objective is to merge the following tool output with the user's FULL context.
Analyze the user's skills against retrieved jobs. Specifically perform: missingSkills = requiredSkills (from jobs) - userSkills (from profile).
Return ONLY valid JSON with this exact structure:
{
  "skillAnalysis": {
    "userSkills": [...],
    "missingSkills": [...],
    "skillGaps": [...],
    "priority": [...],
    "targetRole": "..."
  },
  "refinedInsights": "A targeted summary of WHY these specific skill gaps matter for their profile goals."
}

EXISTING TOOL OUTPUT TO REFINE:
${JSON.stringify(toolOutput, null, 2)}
`;

      const finalPrompt = getAgentPrompt(state, agentSpecificTask);

      const llm = createLLM({ temperature: 0.3, caller: "skillAgent" });
      const response = await llm.invoke(finalPrompt);
      const text = response.content || "";

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const refined = JSON.parse(jsonMatch[0]);
        console.log("[SkillAgent] Context-aware reasoning successful.");
        return {
          status: "success",
          source: `${matcherResult?.source || "skillMatcher"}, reasoning: LLM(full_context)`,
          reasoning: refined.refinedInsights || "Refined skill analysis using full user context.",
          data: {
            skillAnalysis: refined.skillAnalysis || analysisData,
            vectorMatches: vectorMatches,
            targetRole: refined.skillAnalysis?.targetRole || targetRole
          }
        };
      }
    } catch (refineErr) {
      console.warn(`[SkillAgent] Reasoning layer failed (${refineErr.message}). Falling back to tool output.`);
    }

    return {
      status: "success",
      source: matcherResult?.source || "skillMatcher",
      reasoning: "Successfully matched user skills and generated a skill gap analysis.",
      data: toolOutput
    };

  } catch (error) {
    console.error("[SkillAgent] Encountered an error:", error);
    
    return {
      status: "error",
      error: {
        agent: "skillAgent",
        message: error.message
      }
    };
  }
};

module.exports = skillAgent;
