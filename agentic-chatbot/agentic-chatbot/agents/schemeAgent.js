// Scheme Agent
// Finds and recommends relevant government schemes such as Skill India, PMKVY, NASSCOM FutureSkills
// Validates user skills and missing skills, combines them, calls the MCP tool, and returns the updated state.

const { findGovtSchemes } = require("../mcp-tools/govtSchemeFinder");

/**
 * Scheme Agent Node for LangGraph
 * Analyzes the user's skills and missing skills to recommend relevant government training schemes.
 * 
 * @param {Object} state - The current state of the LangGraph workflow
 * @returns {Object} State updates formatted dynamically
 */
async function schemeAgent(state) {
  console.log("--- SCHEME AGENT EXECUTION ---");

  try {
    const userSkills = state.data?.userSkills || state.userSkills || [];
    
    const skillAnalysis = state.data?.skillAnalysis || state.skillAnalysis || state.skillMatchResult || {};
    const missingSkills = Array.isArray(skillAnalysis.missingSkills) 
      ? skillAnalysis.missingSkills 
      : Array.isArray(skillAnalysis.skillGaps)
        ? skillAnalysis.skillGaps 
        : [];

    const searchSkills = [...userSkills, ...missingSkills];

    if (searchSkills.length === 0) {
      console.warn("[SchemeAgent] Warning: No skills found in state.");
      return {
        status: "error",
        error: {
          agent: "schemeAgent",
          message: "No skills to search for schemes"
        }
      };
    }

    console.log(`[SchemeAgent] Searching for government schemes based on: ${searchSkills.join(', ')}`);

    let schemes = [];
    let source = "none";
    let message = "No schemes found";

    if (typeof findGovtSchemes === 'function') {
      const schemeData = await findGovtSchemes(searchSkills);
      if (schemeData && schemeData.status === "success") {
        schemes = schemeData.data;
        source = schemeData.source || "schemeFinder";
        message = schemeData.reasoning || "Successfully retrieved schemes.";
      } else if (schemeData && schemeData.status === "no_data") {
         message = schemeData.message;
      }
    } else {
      const govtSchemeFinder = require("../mcp-tools/govtSchemeFinder");
      if (typeof govtSchemeFinder === 'function') {
        const schemeData = await govtSchemeFinder(searchSkills);
        if (schemeData && schemeData.status === "success") {
          schemes = schemeData.data;
          source = schemeData.source || "schemeFinder";
          message = schemeData.reasoning || "Successfully retrieved schemes.";
        }
      }
    }

    console.log(`[SchemeAgent] Found ${schemes?.length || 0} relevant schemes.`);
    return {
      status: "success",
      source: source,
      reasoning: message,
      data: {
        schemeRecommendations: schemes || []
      }
    };

  } catch (error) {
    console.error("[SchemeAgent] Encountered an error:", error);
    
    return {
      status: "error",
      error: {
        agent: "schemeAgent",
        message: error.message
      }
    };
  }
}

module.exports = schemeAgent;
