// Skill Agent
// Handles skill assessment and recommendations by interacting with the skillMatcher tool
// and updating the LangGraph state.

const { matchSkills } = require('../mcp-tools/skillMatcher');

/**
 * Skill Agent Node for LangGraph
 * 
 * @param {Object} state - The current state of the LangGraph workflow
 * @returns {Object} State updates with strict JSON
 */
const skillAgent = async (state) => {
  console.log("--- SKILL AGENT EXECUTION ---");
  
  try {
    const userSkills = state.data?.userSkills || state.userSkills || [];
    const targetRole = state.data?.targetRole || state.targetRole || null;
    
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

    const matcherResult = await matchSkills(userSkills);

    if (matcherResult && matcherResult.status === "error") {
      return {
        status: "error",
        error: {
          agent: "skillAgent",
          message: matcherResult.message
        }
      };
    }

    console.log("[SkillAgent] Skill gap analysis completed successfully.");
    
    const analysisData = matcherResult?.data?.analysis || {};
    const vectorMatches = matcherResult?.data?.vectorMatches || [];

    return {
      status: "success",
      source: matcherResult?.source || "skillMatcher",
      reasoning: "Successfully matched user skills and generated a skill gap analysis.",
      data: {
        skillAnalysis: analysisData,
        vectorMatches: vectorMatches,
        targetRole: targetRole || analysisData.targetRole || "Unknown Role"
      }
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
