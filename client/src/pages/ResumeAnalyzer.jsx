// import React, { useState } from "react";
// import { analyzeResume } from "../services/resumeAnalyzerService";
// import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
// import { UploadCloud } from "lucide-react";

// const cleanText = (text) => {
//   if (!text) return "";
//   return text
//     .replace(/\*\*/g, "")
//     .replace(/```/g, "")
//     .replace(/^\s*-\s*/gm, "• ")
//     .replace(/\n{2,}/g, "\n\n");
// };

// const ResumeAnalyzer = () => {
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setLoading(true);

//     try {
//       const response = await analyzeResume(file);

//       const skillScore = Math.min((response.skills?.length || 0) * 5, 40);
//       const suggestionPenalty =
//         response.suggestions?.length > 800 ? 10 : 0;

//       const atsScore = Math.min(100, 60 + skillScore - suggestionPenalty);

//       setResult({
//         ...response,
//         atsScore
//       });

//     } catch (error) {
//       console.error(error);
//     }

//     setLoading(false);
//   };

//   const chartData = [{ name: "ATS", value: result?.atsScore || 0 }];

//   return (
//     <div className="w-full min-h-screen bg-gradient-to-b from-[#071428] to-[#020617] text-white p-8">

//       {/* HERO */}

//       <div className="grid lg:grid-cols-2 gap-12 items-center">

//         {/* LEFT SIDE */}

//         <div className="max-w-xl">

//           <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
//             Free ATS Resume Checker
//           </h1>

//           <p className="text-gray-400 text-lg mb-8">
//             Our free ATS Resume Checker scans for 30+ criteria and delivers
//             instant suggestions to boost your resume score — right from your
//             desktop or mobile device.
//           </p>

//           {/* Upload Card */}

//           <div className="border border-dashed border-gray-600 rounded-xl p-8 bg-[#0f172a]">

//             <label
//               htmlFor="resumeUpload"
//               className="flex flex-col items-center cursor-pointer"
//             >

//               <UploadCloud size={40} className="mb-4 text-blue-400" />

//               <span className="bg-teal-500 hover:bg-teal-600 px-6 py-3 rounded-full font-semibold">
//                 Check Your Score
//               </span>

//               <p className="text-sm text-gray-400 mt-4 text-center">
//                 Upload or choose a file: DOC, DOCX, PDF, HTML, RTF, TXT
//                 <br />
//                 (max 5MB)
//               </p>

//             </label>

//             <input
//               type="file"
//               id="resumeUpload"
//               className="hidden"
//               onChange={handleUpload}
//             />

//           </div>

//           {/* STATS */}

//           <div className="flex gap-12 mt-8 text-sm">

//             <div>
//               <p className="text-yellow-400 font-semibold">
//                 ↑ 30% higher chance
//               </p>
//               <p className="text-gray-400">of getting a job</p>
//             </div>

//             <div>
//               <p className="text-green-400 font-semibold">
//                 ↑ 42% response rate
//               </p>
//               <p className="text-gray-400">from recruiters</p>
//             </div>

//           </div>

//         </div>

//         {/* RIGHT SIDE IMAGE */}

//         <div className="hidden lg:flex justify-center">

//           <img
//             src="/resume.png"
//             alt="Resume preview"
//             className="w-[420px] rounded-xl shadow-2xl"
//           />

//         </div>

//       </div>

//       {/* LOADING */}

//       {loading && (
//         <p className="text-gray-400 mt-10">
//           Analyzing resume...
//         </p>
//       )}

//       {/* RESULTS */}

//       {result && (

//         <div className="mt-16 space-y-10">

//           {/* ATS SCORE */}

//           <div className="bg-[#0f172a] p-8 rounded-xl flex flex-col md:flex-row items-center justify-between gap-8">

//             <div>

//               <h2 className="text-2xl font-semibold mb-2">
//                 ATS Score
//               </h2>

//               <p className="text-gray-400">
//                 Resume compatibility with applicant tracking systems
//               </p>

//             </div>

//             <div className="flex items-center gap-6">

//               <RadialBarChart
//                 width={200}
//                 height={200}
//                 innerRadius="70%"
//                 outerRadius="100%"
//                 data={chartData}
//                 startAngle={90}
//                 endAngle={-270}
//               >

//                 <PolarAngleAxis
//                   type="number"
//                   domain={[0, 100]}
//                   tick={false}
//                 />

//                 <RadialBar
//                   dataKey="value"
//                   cornerRadius={10}
//                   fill="#22c55e"
//                 />

//               </RadialBarChart>

//               <div className="text-4xl font-bold text-green-400">
//                 {result.atsScore}
//               </div>

//             </div>

//           </div>

//           {/* SKILLS */}

//           <div className="bg-[#0f172a] p-8 rounded-xl">

//             <h2 className="text-2xl font-semibold mb-6">
//               Extracted Skills
//             </h2>

//             <div className="flex flex-wrap gap-3">

//               {result.skills?.map((skill, index) => (

//                 <span
//                   key={index}
//                   className="bg-purple-600 px-4 py-1 rounded-full text-sm"
//                 >
//                   {skill}
//                 </span>

//               ))}

//             </div>

//           </div>

//           {/* SUGGESTIONS */}

//           <div className="bg-[#0f172a] p-8 rounded-xl">

//             <h2 className="text-2xl font-semibold mb-6">
//               Resume Suggestions
//             </h2>

//             <div className="space-y-3 text-gray-300 leading-relaxed">

//               {cleanText(result.suggestions)
//                 .split("\n")
//                 .map((line, i) => (
//                   <p key={i}>{line}</p>
//                 ))}

//             </div>

//           </div>

//         </div>

//       )}

//     </div>
//   );
// };

// export default ResumeAnalyzer;




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
    <div className="w-full min-h-screen px-10 py-12 text-white bg-[#020617]">

      {/* HERO */}

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT */}

        <div>

          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Free ATS Resume Checker
          </h1>

          <p className="text-gray-400 text-lg mb-10">
            Scan your resume against ATS systems and receive
            actionable insights to improve your chances of
            landing interviews.
          </p>

          {/* Upload */}

          <div className="bg-gradient-to-r from-red-900/40 to-indigo-900/30 border border-white/10 p-10 rounded-2xl backdrop-blur">

            <label
              htmlFor="resumeUpload"
              className="flex flex-col items-center cursor-pointer"
            >

              <UploadCloud size={42} className="text-blue-400 mb-4"/>

              <span className="bg-teal-500 hover:bg-teal-600 px-8 py-3 rounded-full font-semibold text-lg transition">
                Upload Resume
              </span>

              <p className="text-gray-400 text-sm mt-4 text-center">
                DOC • DOCX • PDF • HTML • TXT  
                <br />
                Max file size 5MB
              </p>

            </label>

            <input
              type="file"
              id="resumeUpload"
              className="hidden"
              onChange={handleUpload}
            />

          </div>

          {/* STATS */}

          <div className="flex gap-16 mt-10">

            <div>
              <p className="text-yellow-400 font-semibold text-lg">
                ↑ 30% higher chance
              </p>
              <p className="text-gray-400 text-sm">
                of getting a job
              </p>
            </div>

            <div>
              <p className="text-green-400 font-semibold text-lg">
                ↑ 42% response rate
              </p>
              <p className="text-gray-400 text-sm">
                from recruiters
              </p>
            </div>

          </div>

        </div>

        {/* RIGHT IMAGE */}

        <div className="flex flex-col gap-6 justify-center">

          <div className="bg-[#0f172a] p-6 rounded-2xl shadow-xl border border-white/10">

            <img
              src="/resume.png"
              alt="Resume"
              className="w-[350px] rounded-xl"
            />

          </div>

          <div className="bg-black/50 p-6 rounded-2xl border border-white/5 opacity-80 pointer-events-none">
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">AI Processing Pipeline</h3>
            <FlowVisualizer />
          </div>

        </div>

      </div>


      {/* LOADING */}

      {loading && (
        <div className="text-center mt-16 text-gray-400">
          <Sparkles className="animate-spin mx-auto mb-4" />
          Analyzing Resume...
        </div>
      )}


      {/* RESULTS */}

      {result && (

        <div className="max-w-6xl mx-auto mt-20 space-y-10">

          {/* ATS SCORE */}

          <div className="bg-[#0f172a] border border-white/10 p-10 rounded-2xl flex flex-col md:flex-row items-center justify-between">

            <div>

              <h2 className="text-2xl font-semibold mb-2">
                ATS Score
              </h2>

              <p className="text-gray-400">
                Resume compatibility with applicant tracking systems
              </p>

            </div>

            <div className="flex items-center gap-8 mt-6 md:mt-0">

              <RadialBarChart
                width={180}
                height={180}
                innerRadius="70%"
                outerRadius="100%"
                data={[{ name: "ATS", value: result.atsScore }]}
                startAngle={90}
                endAngle={-270}
              >

                <PolarAngleAxis
                  type="number"
                  domain={[0,100]}
                  tick={false}
                />

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

          <div className="bg-[#0f172a] border border-white/10 p-10 rounded-2xl">

            <h2 className="text-2xl font-semibold mb-6">
              Extracted Skills
            </h2>

            <div className="flex flex-wrap gap-3">

              {result.skills?.map((skill, index) => (

                <span
                  key={index}
                  className="bg-purple-600/80 hover:bg-purple-600 px-4 py-2 rounded-full text-sm transition"
                >
                  {skill}
                </span>

              ))}

            </div>

          </div>


          {/* SUGGESTIONS */}

          <div className="bg-[#0f172a] border border-white/10 p-10 rounded-2xl">

            <h2 className="text-2xl font-semibold mb-8">
              Resume Suggestions
            </h2>

            <div className="space-y-6">

              {cleanText(result.suggestions)
                .split("\n\n")
                .map((block, index) => {

                  const lines = block.split("\n");

                  const heading = lines[0];
                  const content = lines.slice(1);

                  return (

                    <div
                      key={index}
                      className="border-l-4 border-blue-500 pl-5"
                    >

                      <h3 className="text-lg font-semibold mb-2">
                        {heading}
                      </h3>

                      <div className="space-y-1 text-gray-300">

                        {content.map((line, i) => (
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
  );
};

export default ResumeAnalyzer;