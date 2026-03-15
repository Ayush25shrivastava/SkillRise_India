// Roadmap Agent
// Generates personalized learning roadmaps based on the user's target role and missing skills

const fs = require('fs');
const path = require('path');

/**
 * Roadmap Agent Node for LangGraph
 * Generates a personalized learning roadmap.
 * 
 * @param {Object} state - The current state of the LangGraph workflow
 * @returns {Object} State updates formatted dynamically
 */
async function roadMapAgent(state) {
  console.log("--- ROADMAP AGENT EXECUTION ---");

  try {
    const targetRole = state.data?.targetRole || state.targetRole;
    
    const skillAnalysis = state.data?.skillAnalysis || state.skillAnalysis || state.skillMatchResult || {};
    const missingSkills = Array.isArray(skillAnalysis.missingSkills) 
      ? skillAnalysis.missingSkills 
      : Array.isArray(skillAnalysis.skillGaps) 
        ? skillAnalysis.skillGaps 
        : [];

    if (!targetRole) {
      console.warn("[RoadMapAgent] Warning: No targetRole specified in state.");
      return {
        status: "error",
        error: {
          agent: "roadmapAgent",
          message: "No targetRole specified"
        }
      };
    }

    if (!missingSkills || missingSkills.length === 0) {
      console.log("[RoadMapAgent] No missing skills found. Roadmap is empty.");
      return {
        status: "success",
        source: "skillRoadmap",
        reasoning: "No missing skills; roadmap is not necessary.",
        data: { roadmap: [] }
      };
    }

    const datasetPath = path.join(__dirname, '../data/skillRoadmap.json');
    let skillRoadmapData = {};
    
    if (fs.existsSync(datasetPath)) {
      const fileData = fs.readFileSync(datasetPath, 'utf-8');
      skillRoadmapData = JSON.parse(fileData);
    } else {
      console.warn("[RoadMapAgent] Warning: skillRoadmap.json dataset not found at", datasetPath);
      return {
        status: "error",
        error: {
          agent: "roadmapAgent",
          message: "skillRoadmap dataset missing"
        }
      };
    }

    const generalRoadmap = skillRoadmapData[targetRole];
    
    if (!generalRoadmap) {
      console.warn(`[RoadMapAgent] Warning: No predefined roadmap found for role "${targetRole}".`);
      return {
        status: "no_data",
        source: "dataset",
        reasoning: `No predefined roadmap found for role ${targetRole}.`,
        data: { roadmap: [] }
      };
    }

    const personalizedRoadmap = [];
    const missingSkillsLower = missingSkills.map(skill => skill.toLowerCase());

    for (const [phaseName, phaseSkills] of Object.entries(generalRoadmap)) {
      const neededSkills = phaseSkills.filter(skill => {
        // Assume skills in database might be objects with string keys, or strings directly
        if (typeof skill === 'object' && skill.topic) {
          return missingSkillsLower.includes(skill.topic.toLowerCase());
        } else if (typeof skill === 'string') {
          return missingSkillsLower.includes(skill.toLowerCase());
        }
        return false;
      });

      if (neededSkills.length > 0) {
        personalizedRoadmap.push({
          phase: phaseName,
          skills: neededSkills
        });
      }
    }

    console.log(`[RoadMapAgent] Successfully generated personalized roadmap with ${personalizedRoadmap.length} phases.`);
    
    return {
      status: "success",
      source: "dataset",
      reasoning: `Extracted ${personalizedRoadmap.length} roadmap phases matching the user's missing skills from the strict dataset.`,
      data: {
        roadmap: personalizedRoadmap
      }
    };

  } catch (error) {
    console.error("[RoadMapAgent] Encountered an error:", error);
    
    return {
      status: "error",
      error: {
        agent: "roadmapAgent",
        message: error.message
      }
    };
  }
}

module.exports = roadMapAgent;
