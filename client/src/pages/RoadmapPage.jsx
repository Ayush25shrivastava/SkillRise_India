// import { useState, useEffect } from "react";
// import { useRoadmap } from "../hooks/useRoadmap";
// import Roadmap from "../components/Roadmap/RoadmapContainer";

// export default function RoadmapPage() {
//   const { roadmap, generate } = useRoadmap();
//   console.log("Roadmap state:", roadmap);
//   // 🔹 STATES
//   const [careerSwitch, setCareerSwitch] = useState(false);

//   // Dummy (replace with real data from your app)
//   const profile = {}; 
//   const resumeText = "parsed resume text";
//   const targetRole = "Frontend Developer";
//   const duration = "6 months";

//   // 🔹 INITIAL GENERATE
//   // const handleGenerate = () => {
//   //   generate({
//   //     profile,
//   //     resumeText,
//   //     targetRole,
//   //     duration,
//   //     careerSwitch,
//   //     completedSteps: [],
//   //   });
//   // };

//   const handleGenerate = async () => {
//   try {
//     const result = await generate({ profile, resumeText, targetRole, duration, careerSwitch, completedSteps: [] });
//     console.log("generate result:", result);
//   } catch (error) {
//     console.error("generate failed:", error);
//   }
// };

// useEffect(() => {
//   console.log("roadmap state changed:", roadmap);
// }, [roadmap]);

//   console.log("Roadmap after generation:", handleGenerate);
//   // 🔁 ADAPTIVE REGENERATE
//   const regenerate = () => {
//     const saved = JSON.parse(localStorage.getItem("progress")) || {};

//     generate({
//       profile,
//       resumeText,
//       targetRole,
//       duration,
//       careerSwitch,
//       completedSteps: Object.keys(saved).filter((k) => saved[k]),
//     });
//   };

//   return (
    
//     <div className="p-6">

//       {/* 🔥 HEADER CONTROLS */}
//       <div className="flex flex-wrap items-center gap-4 mb-6">

//         {/* 🚀 GENERATE BUTTON */}
//         <button
//           onClick={handleGenerate}
//           className="px-4 py-2 bg-blue-600 rounded"
//         >
//           Generate Roadmap
//         </button>

//         {/* 🔁 ADAPTIVE BUTTON */}
//         <button
//           onClick={regenerate}
//           className="px-4 py-2 bg-purple-600 rounded"
//         >
//           Update Roadmap
//         </button>

//         {/* 🚀 CAREER SWITCH TOGGLE */}
//         <label className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             checked={careerSwitch}
//             onChange={(e) => setCareerSwitch(e.target.checked)}
//           />
//           Career Switch Mode
//         </label>
//       </div>

//       {/* 📊 ROADMAP OUTPUT */}
//       {roadmap && <Roadmap data={roadmap} />}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useRoadmap } from "../hooks/useRoadmap";
import Roadmap from "../components/Roadmap/RoadmapContainer";

export default function RoadmapPage() {
  const { roadmap, generate, error, loading } = useRoadmap();
  const [careerSwitch, setCareerSwitch] = useState(false);

  const profile = {}; 
  const resumeText = "parsed resume text";
  const targetRole = "Frontend Developer";
  const duration = "6 months";

  const handleGenerate = async () => {
    try {
      await generate({ 
        profile, 
        resumeText, 
        targetRole, 
        duration, 
        careerSwitch, 
        completedSteps: [] 
      });
    } catch (error) {
      console.error("Generation failed:", error);
    }
  };

  const regenerate = async () => {
    const saved = JSON.parse(localStorage.getItem("progress")) || {};
    try {
      await generate({
        profile,
        resumeText,
        targetRole,
        duration,
        careerSwitch,
        completedSteps: Object.keys(saved).filter((k) => saved[k]),
      });
    } catch (error) {
      console.error("Regeneration failed:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "⏳ Generating..." : "Generate Roadmap"}
        </button>

        <button
          onClick={regenerate}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Update Roadmap
        </button>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={careerSwitch}
            onChange={(e) => setCareerSwitch(e.target.checked)}
            disabled={loading}
          />
          Career Switch Mode
        </label>
      </div>

      {loading && (
        <div className="bg-blue-900/30 border border-blue-500 text-blue-200 px-4 py-3 rounded mb-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
            <span>Waiting for AI response... This may take a moment.</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
          <p className="font-semibold mb-1">❌ Error:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {roadmap && roadmap.length > 0 && <Roadmap data={roadmap} />}
      
      {!loading && !error && (!roadmap || roadmap.length === 0) && (
        <div className="text-gray-400 text-center py-8">
          Click "Generate Roadmap" to start
        </div>
      )}
    </div>
  );
}
