// import { useState } from "react";
// import axios from "axios";

// export default function ResumeUpload(){

//  const [file,setFile] = useState(null);
//  const [result,setResult] = useState(null);

//  const handleUpload = async()=>{

//   const form = new FormData();
//   form.append("resume",file);

//   const res = await axios.post(
//    "http://localhost:5001/analyze",
//    form
//   );

//   setResult(res.data);
//  };

//  return(
//   <div>

//    <h2>Resume Analyzer</h2>

//    <input
//     type="file"
//     onChange={(e)=>setFile(e.target.files[0])}
//    />

//    <button onClick={handleUpload}>
//     Analyze Resume
//    </button>

//    {result && (
//     <div>

//      <h3>ATS Score: {result.score}</h3>

//      <h4>Skills</h4>
//      <ul>
//       {result.skills.map(skill=>(
//         <li key={skill}>{skill}</li>
//       ))}
//      </ul>

//      <h4>Suggestions</h4>
//      <p>{result.suggestions}</p>

//     </div>
//    )}

//   </div>
//  );
// }

import { useState } from "react";
import { analyzeResume } from "../services/api";

export default function ResumeUpload(){

 const [file,setFile] = useState(null);
 const [result,setResult] = useState(null);

 const handleUpload = async()=>{

  if(!file){
   alert("Please upload a resume");
   return;
  }

  const form = new FormData();
  form.append("resume",file);

  try{

   const data = await analyzeResume(form);

   setResult(data);

  }catch(err){
   console.error(err);
   alert("Error analyzing resume");
  }

 };

 return(
  <div>

   <h2>Resume Analyzer</h2>

   <input
    type="file"
    onChange={(e)=>setFile(e.target.files[0])}
   />

   <button onClick={handleUpload}>
    Analyze Resume
   </button>

   {result && (
    <div>

     <h3>ATS Score: {result.score}</h3>

     <h4>Skills</h4>
     <ul>
      {result.skills.map((skill,index)=>(
        <li key={index}>{skill}</li>
      ))}
     </ul>

     <h4>Suggestions</h4>
     <p>{result.suggestions}</p>

    </div>
   )}

  </div>
 );
}