import React, { useState } from "react";
import { analyzeResume } from "../services/resumeAnalyzerService";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { UploadCloud, Sparkles } from "lucide-react";
import FlowVisualizer from "../components/FlowVisualizer";

const cleanText = (text) => {
  if (!text) return "";
  return text
    .replace(/\*\*/g, "")
    .replace(/```/g, "")
    .replace(/^\s*-\s*/gm, "• ")
    .replace(/\n{2,}/g, "\n\n");
};

const ResumeAnalyzer = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      const response = await analyzeResume(file);

      const skillScore = Math.min((response.skills?.length || 0) * 5, 40);
      const suggestionPenalty =
        response.suggestions?.length > 800 ? 10 : 0;

      const atsScore = Math.min(100, 60 + skillScore - suggestionPenalty);

      setResult({
        ...response,
        atsScore,
      });
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
<div className="min-h-screen bg-[#020617] text-white px-6 py-24 flex justify-center">

<div className="w-full max-w-[1400px] flex flex-col items-center">

{/* HEADER */}

<div className="text-center max-w-3xl space-y-6">

<h1 className="text-5xl md:text-6xl font-bold">
AI Powered ATS Resume Checker
</h1>

<p className="text-gray-400 text-lg leading-relaxed space-x-2">
Upload your resume and our AI will analyze it against modern
Applicant Tracking Systems to measure compatibility,
extract skills, and provide professional suggestions
to improve your chances of landing interviews.
</p>

</div>


{/* PIPELINE */}
<div className="mt-20"></div>

<div className="w-full mt-20 bg-white/5 border border-white/10 space-y-2 rounded-2xl p-12 backdrop-blur-xl shadow-xl">

<h3 className="text-sm uppercase tracking-widest text-gray-400 text-center  mb-10">
AI Processing Pipeline
</h3>

<FlowVisualizer />

</div>


{/* UPLOAD CARD */}

<div className="mt-20 w-full flex justify-center">

<div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40
border border-white/10 rounded-2xl px-14 py-12 shadow-2xl backdrop-blur-xl
max-w-md w-full text-center">

<label
htmlFor="resumeUpload"
className="flex flex-col items-center space-y-6 cursor-pointer"
>

<UploadCloud size={60} className="text-blue-400"/>

<span className="bg-teal-500 hover:bg-teal-600 px-8 py-3 rounded-full font-semibold text-lg transition shadow-lg">
Upload Resume
</span>

<p className="text-gray-400 text-sm leading-relaxed">
Supported formats: DOC • DOCX • PDF • TXT
<br/>
Maximum size: 5MB
</p>

</label>

<input
type="file"
id="resumeUpload"
className="hidden"
onChange={handleUpload}
/>

</div>

</div>


{/* FEATURE CARDS */}

<div className="mt-24 grid md:grid-cols-3 gap-14 w-full">

<div className="bg-blue-900/20 border border-blue-400/20 p-10 rounded-xl
backdrop-blur-lg shadow-lg hover:shadow-blue-500/40 transition">

<h3 className="text-blue-300 text-xl font-semibold mb-4">
Higher Interview Chances
</h3>

<p className="text-gray-300 leading-relaxed">
Improve resume structure and keyword alignment
to increase your chances of passing ATS screening systems.
</p>

</div>


<div className="bg-blue-900/20 border border-blue-400/20 p-10 rounded-xl
backdrop-blur-lg shadow-lg hover:shadow-blue-500/40 transition">

<h3 className="text-blue-300 text-xl font-semibold mb-4">
Skill Extraction
</h3>

<p className="text-gray-300 leading-relaxed">
Automatically detect technical and professional skills
mentioned in your resume.
</p>

</div>


<div className="bg-blue-900/20 border border-blue-400/20 p-10 rounded-xl
backdrop-blur-lg shadow-lg hover:shadow-blue-500/40 transition">

<h3 className="text-blue-300 text-xl font-semibold mb-4">
AI Suggestions
</h3>

<p className="text-gray-300 leading-relaxed">
Get personalized suggestions to improve formatting,
keywords and recruiter visibility.
</p>

</div>

</div>


{/* LOADING */}

{loading && (

<div className="mt-24 text-gray-400 text-center">

<Sparkles className="animate-spin mx-auto mb-4"/>

Analyzing Resume...

</div>

)}


{/* RESULTS */}

{result && (

<div className="mt-28 w-full space-y-14 text-left">

{/* ATS SCORE */}

<div className="bg-white/5 border border-white/10 rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-12">

<div>

<h2 className="text-2xl font-semibold mb-2">
ATS Compatibility Score
</h2>

<p className="text-gray-400 leading-relaxed">
This score indicates how well your resume matches modern ATS requirements.
</p>

</div>

<div className="flex items-center gap-6">

<RadialBarChart
width={180}
height={180}
innerRadius="70%"
outerRadius="100%"
data={[{ value: result.atsScore }]}
startAngle={90}
endAngle={-270}
>

<PolarAngleAxis type="number" domain={[0,100]} tick={false} />

<RadialBar
dataKey="value"
cornerRadius={10}
fill="#22c55e"
/>

</RadialBarChart>

<span className="text-5xl font-bold text-green-400">
{result.atsScore}
</span>

</div>

</div>


{/* SKILLS */}

<div className="bg-white/5 border border-white/10 rounded-2xl p-10">

<h2 className="text-xl font-semibold mb-6">
Extracted Skills
</h2>

<div className="flex flex-wrap gap-3">

{result.skills?.map((skill,index)=>(
<span
key={index}
className="bg-purple-600/80 px-4 py-2 rounded-full text-sm"
>
{skill}
</span>
))}

</div>

</div>


{/* SUGGESTIONS */}

<div className="bg-white/5 border border-white/10 rounded-2xl p-10">

<h2 className="text-xl font-semibold mb-6">
Resume Improvement Suggestions
</h2>

<div className="space-y-6">

{cleanText(result.suggestions)
.split("\n\n")
.map((block,index)=>{

const lines = block.split("\n");

return(

<div
key={index}
className="border-l-4 border-blue-500 pl-4"
>

<h3 className="font-semibold text-lg mb-2">
{lines[0]}
</h3>

<div className="text-gray-300 space-y-1">

{lines.slice(1).map((line,i)=>(
<p key={i}>{line}</p>
))}

</div>

</div>

);

})}

</div>

</div>

</div>

)}

</div>
</div>
);
  
};

export default ResumeAnalyzer;