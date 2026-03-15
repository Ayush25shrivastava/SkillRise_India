// Career Agent
// Recommends suitable career paths, job roles, and learning resources based on the user's skill profile.
// If job recommendations fail, still passes through what data is available.

let jobRecommender;
try {
  const jobRec = require("../mcp-tools/jobRecommender");
  jobRecommender = jobRec.recommendJobs || jobRec;
} catch (error) {
  console.warn("[CareerAgent] jobRecommender tool could not be loaded properly.");
}

let courseFinder;
try {
  const cFinder = require("../mcp-tools/courseFinder");
  courseFinder = cFinder.findCourses || cFinder;
} catch (error) {
  console.warn("[CareerAgent] courseFinder tool could not be loaded properly.");
}

/**
 * Career Agent Node for LangGraph
 * Recommends job roles based on skills and finds relevant courses.
 *
 * @param {Object} state - The current state of the LangGraph workflow
 * @returns {Object} State updates formatted dynamically
 */
async function careerAgent(state) {
  console.log("--- CAREER AGENT EXECUTION ---");

  try {
    const userSkills = state.data?.userSkills || state.userSkills || [];

    if (!userSkills || userSkills.length === 0) {
      console.warn("[CareerAgent] Warning: No user skills found in state.");
      return {
        status: "error",
        error: { agent: "careerAgent", message: "User skills missing" }
      };
    }

    console.log(`[CareerAgent] Finding recommendations for skills: ${userSkills.join(', ')}`);

    let careerRecommendations = [];
    let jobSource = "none";
    let targetRole = state.data?.targetRole || state.targetRole || null;
    
    // ─── Step 1: Get Job Recommendations ──────────────────────────────────
    if (typeof jobRecommender === 'function') {
      try {
        const recommendationsResult = await jobRecommender(userSkills);
        if (recommendationsResult && recommendationsResult.status === "success" && recommendationsResult.data) {
          careerRecommendations = recommendationsResult.data;
          jobSource = recommendationsResult.source || "jobRecommender";
          console.log(`[CareerAgent] Got ${careerRecommendations.length} job recommendations (source: ${jobSource})`);
        } else {
          console.warn("[CareerAgent] Job recommender returned no data:", recommendationsResult?.message);
        }
      } catch (jobErr) {
        console.error("[CareerAgent] Job recommender threw:", jobErr.message);
      }
    }

    // Determine the top target role from recommendations for course finding
    if (careerRecommendations.length > 0) {
      const topRec = careerRecommendations[0];
      targetRole = topRec.jobTitle || topRec.role || targetRole;
    }

    // ─── Step 2: Find Courses for the Target Role ──────────────────────────
    let recommendedCourses = [];
    let courseSource = "none";

    if (targetRole && typeof courseFinder === 'function') {
      try {
        const courseResults = await courseFinder(targetRole);
        if (courseResults && courseResults.status === "success" && courseResults.data) {
          recommendedCourses = courseResults.data;
          courseSource = courseResults.source || "courseFinder";
          console.log(`[CareerAgent] Found ${recommendedCourses.length} courses for role: ${targetRole}`);
        }
      } catch (courseErr) {
        console.error("[CareerAgent] Course finder threw:", courseErr.message);
      }
    }

    // ─── Always return data, even if partial ─────────────────────────────
    const hasData = careerRecommendations.length > 0 || targetRole;

    return {
      status: hasData ? "success" : "no_data",
      source: `job: ${jobSource}, course: ${courseSource}`,
      reasoning: hasData
        ? "Generated career and course recommendations successfully."
        : "No recommendations could be generated from the provided skills.",
      data: {
        careerRecommendations,
        targetRole,
        recommendedCourses
      }
    };

  } catch (error) {
    console.error("[CareerAgent] Encountered an error:", error);
    
    return {
      status: "error",
      error: { agent: "careerAgent", message: error.message }
    };
  }
}

module.exports = careerAgent;
