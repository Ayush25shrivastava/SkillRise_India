// import axios from "axios";

// export const generateRoadmap = async (data) => {
//   const res = await axios.post("http://localhost:5000/api/roadmap/generate", data);
//   return res.data;
// };

import axios from "axios";

export const generateRoadmap = async (data) => {
  try {
    const res = await axios.post("http://localhost:5000/api/roadmap/generate", data, {
      timeout: 60000, // 60 seconds timeout - wait for LLM response
    });
    return res.data;
  } catch (err) {
    // Pass through the exact error from backend
    if (err.response?.data) {
      throw err.response.data;
    }
    throw { error: true, message: err.message };
  }
};
