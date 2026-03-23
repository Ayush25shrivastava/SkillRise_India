import { useState } from "react";
import { generateRoadmap, updateRoadmap, careerSwitchRoadmap } from "../services/roadmapApi";

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

  const update = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔄 Updating roadmap...");
      const res = await updateRoadmap(formData);
      
      if (res.error) {
        console.error("❌ Error from backend:", res.message);
        setError(res.message);
        return res;
      }
      
      console.log("✅ Roadmap updated:", res.roadmap?.length, "items");
      setRoadmap(res?.roadmap ?? res ?? []);
      return res;
      
    } catch (err) {
      console.error("❌ Roadmap update failed:", err);
      const errorMessage = err.message || "Failed to update roadmap";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const careerSwitchGenerate = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      setRoadmap(null);
      
      console.log("🔀 Generating career switch roadmap...");
      const res = await careerSwitchRoadmap(formData);
      
      if (res.error) {
        console.error("❌ Error from backend:", res.message);
        setError(res.message);
        setRoadmap([]);
        return res;
      }
      
      console.log("✅ Career switch roadmap received:", res.roadmap?.length, "items");
      setRoadmap(res?.roadmap ?? res ?? []);
      return res;
      
    } catch (err) {
      console.error("❌ Career switch generation failed:", err);
      const errorMessage = err.message || "Failed to generate career switch roadmap";
      setError(errorMessage);
      setRoadmap([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };


  return { roadmap, generate, update, careerSwitchGenerate, error, loading};
};
