import { useState } from "react";

import ResumeUpload from "../components/ResumeUpload";
import ATSScoreCard from "../components/ATSScoreCard";
import SkillList from "../components/SkillList";
import Suggestions from "../components/Suggestions";
import FlowVisualizer from "../components/FlowVisualizer";

export default function AnalyzerPage(){

 const [result,setResult] = useState(null);

 return(

  <div>

   <h1>AI Resume Analyzer</h1>

   <FlowVisualizer/>

   <ResumeUpload setResult={setResult}/>

   {result && (

    <div>

     <ATSScoreCard score={result.score}/>

     <SkillList skills={result.skills}/>

     <Suggestions suggestions={result.suggestions}/>

    </div>

   )}

  </div>

 );

}