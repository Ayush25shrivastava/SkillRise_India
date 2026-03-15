// Resume Agent
// Extracts structured information from a user's resume so that downstream agents can use it for:
// - skill matching
// - job recommendations
// - roadmap generation
// - government scheme discovery

let resumeAnalyzer;
try {
  resumeAnalyzer = require("../mcp-tools/resumeAnalyzer");
} catch (err) {
  const { parseResume } = require("../mcp-tools/resumeParser");
  resumeAnalyzer = parseResume;
}

const fs = require('fs');
const vectorMemory = require("../memory/vectorMemory");

/**
 * Resume Agent Node for LangGraph
 * Acts as the first step in the pipeline.
 *
 * @param {Object} state - The current state of the LangGraph workflow
 * @returns {Object} State updates with strict JSON format
 */
async function resumeAgent(state) {
  console.log("--- RESUME AGENT EXECUTION ---");

  try {
    const resumeFilePath = state.resumeFilePath;

    if (!resumeFilePath) {
      console.error("[ResumeAgent] Error: No resumeFilePath provided.");
      return {
        status: "error",
        error: {
          agent: "resumeAgent",
          message: "No resume file path provided"
        }
      };
    }

    if (!fs.existsSync(resumeFilePath)) {
      console.error(`[ResumeAgent] Error: File not found at ${resumeFilePath}`);
      return {
        status: "error",
        error: {
          agent: "resumeAgent",
          message: "Resume file does not exist on disk"
        }
      };
    }

    console.log(`[ResumeAgent] Analyzing resume found at: ${resumeFilePath}`);

    const resumeBuffer = fs.readFileSync(resumeFilePath);

    const resumeData = await resumeAnalyzer(resumeBuffer);

    if (!resumeData || typeof resumeData !== 'object' || Object.keys(resumeData).length === 0) {
      console.warn("[ResumeAgent] Warning: Analyzer returned empty results.");
      return {
        status: "error",
        error: {
          agent: "resumeAgent",
          message: "Analyzer failed to extract data"
        }
      };
    }

    const extractedSkills = resumeData.skills || [];
    const extractedEducation = resumeData.education || [];
    const extractedExperience = resumeData.experience || [];

    const resumeAnalysisInfo = {
       name: resumeData.personalInfo?.name || resumeData.name || "Unknown Candidate",
       summary: resumeData.summary || "",
       contact: resumeData.personalInfo || {}
    };

    console.log(`[ResumeAgent] Extraction complete. Found ${extractedSkills.length} skills.`);

    // Vectorize the extracted resume content into Pinecone for semantic search memory
    const resumeTextSummary = `User uploaded Resume Data.
Name: ${resumeAnalysisInfo.name}
Summary: ${resumeAnalysisInfo.summary}
Skills: ${extractedSkills.join(', ')}
Education: ${extractedEducation.map(ed => `${ed.degree} from ${ed.institution}`).join('; ')}
Experience: ${extractedExperience.map(ex => `${ex.jobTitle} at ${ex.company}: ${ex.description}`).join(' | ')}`;

    const resumeNodeId = "resume_node_" + Date.now();
    
    // Store in hybrid memory mapped to this thread
    if (state.threadId) {
      console.log(`[ResumeAgent] Generating vector embeddings for resume and storing to semantic memory...`);
      await vectorMemory.storeEmbedding(state.threadId, resumeNodeId, resumeTextSummary, "system_resume");
    }

    return {
      status: "success",
      source: "resumeAnalyzer tool",
      reasoning: `Extracted ${extractedSkills.length} skills from the user's uploaded resume.`,
      data: {
        userSkills: extractedSkills,
        education: extractedEducation,
        experience: extractedExperience,
        resumeAnalysis: resumeAnalysisInfo
      }
    };

  } catch (error) {
    console.error("[ResumeAgent] Encountered an error:", error);
    
    return {
      status: "error",
      error: {
        agent: "resumeAgent",
        message: error.message
      }
    };
  }
}

module.exports = resumeAgent;
