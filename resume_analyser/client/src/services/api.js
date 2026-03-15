import axios from "axios";

const API = axios.create({
 baseURL:import.meta.env.VITE_API_URL
});

export const analyzeResume = async(formData)=>{

 const res = await API.post(
  "/analyze",
  formData,
  {
   headers:{
    "Content-Type":"multipart/form-data"
   }
  }
 );

 return res.data;
};