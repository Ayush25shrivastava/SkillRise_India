// import { buildRoadmapPrompt } from "../services/promptBuilder.js";
// import { generateRoadmapFromAI } from "../services/aiService.js";
// import { formatRoadmap } from "../services/roadmapFormatter.js";

// export const generateRoadmap = async (req, res) => {
//   console.log("Received roadmap request with data:", req.body);
//   try {
//     const {
//       profile,
//       resumeText,
//       targetRole,
//       duration,
//       completedSteps,
//       careerSwitch,
//     } = req.body;

//     const prompt = buildRoadmapPrompt({
//       profile,
//       resumeText,
//       targetRole,
//       duration,
//       completedSteps,
//       careerSwitch,
//     });

//     const raw = await generateRoadmapFromAI(prompt);
//     const formatted = formatRoadmap(raw);
//     res.json(formatted);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

import { buildRoadmapPrompt } from "../services/promptBuilder.js";
import { generateRoadmapFromAI } from "../services/aiService.js";
import { formatRoadmap } from "../services/roadmapFormatter.js";

export const generateRoadmap = async (req, res) => {
  console.log("📥 Received roadmap request");
  
  try {
    const {
      profile,
      resumeText,
      targetRole,
      duration,
      completedSteps,
      careerSwitch,
    } = req.body;

    console.log("🔨 Building prompt...");
    const prompt = buildRoadmapPrompt({
      profile,
      resumeText,
      targetRole,
      duration,
      completedSteps,
      careerSwitch,
    });

    console.log("🤖 Calling AI service...");
    const raw = await generateRoadmapFromAI(prompt);
    
    console.log("📋 Formatting response...");
    const formatted = formatRoadmap(raw);
    
    console.log("✅ Roadmap generated successfully");
    res.json(formatted);
    
  } catch (err) {
    console.error("❌ Roadmap generation error:", err.message);
    
    // Send the exact error message from LLM
    res.status(500).json({ 
      error: true,
      message: err.message,
      roadmap: [],
      details: err.stack
    });
  }
};
