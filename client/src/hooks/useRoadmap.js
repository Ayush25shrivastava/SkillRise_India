// import { useState } from "react";
// import { generateRoadmap } from "../services/roadmapApi";

// export const useRoadmap = () => {
//   const [roadmap, setRoadmap] = useState(null);

//   const generate = async (data) => {
//     try {
//       const res = await generateRoadmap(data);
//         //CHANGE 1 DONE HERE
//         setRoadmap(res?.roadmap?? res ??  []);
//       // depending on backend response
//       return res;
//     } catch (err) {
//       console.error("Roadmap error:", err);
//     }
//   };

//   return { roadmap, generate };
// };

import { useState } from "react";
import { generateRoadmap } from "../services/roadmapApi";

export const useRoadmap = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setRoadmap(null);
      
      console.log("🚀 Starting roadmap generation...");
      const res = await generateRoadmap(data);
      
      if (res.error) {
        console.error("❌ Error from backend:", res.message);
        setError(res.message);
        setRoadmap([]);
        return res;
      }
      
      console.log("✅ Roadmap received:", res.roadmap?.length, "items");
      setRoadmap(res?.roadmap ?? res ?? []);
      return res;
      
    } catch (err) {
      console.error("❌ Roadmap generation failed:", err);
      const errorMessage = err.message || "Failed to generate roadmap";
      setError(errorMessage);
      setRoadmap([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { roadmap, generate, error, loading };
};
