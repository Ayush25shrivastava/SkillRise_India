import axios from "axios";

export const createProfile = async (data) => {
  const token = localStorage.getItem("token");
  console.log("TOKEN:", token);
  return axios.post("http://localhost:5000/api/profile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    
  });
};