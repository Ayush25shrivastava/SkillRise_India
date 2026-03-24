import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_ANALYZER_API_URL || "http://localhost:5001/api/analyzer"
});

export const analyzeResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await API.post("/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return res.data;
};