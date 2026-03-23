// import { useState, useEffect } from "react";
// import { useRoadmap } from "../hooks/useRoadmap";
// import Roadmap from "../components/Roadmap/RoadmapContainer";

// export default function RoadmapPage() {
//   const { roadmap, generate, error, loading } = useRoadmap();
//   const [careerSwitch, setCareerSwitch] = useState(false);
//   const [pdfFile, setPdfFile] = useState(null);
//   const [targetRole, setTargetRole] = useState("");
//   const [duration, setDuration] = useState("");

//   useEffect(() => {
//     // Load profile from localStorage or API
//     const savedProfile = localStorage.getItem("userProfile");
//     if (savedProfile) {
//       setProfile(JSON.parse(savedProfile));
//     }
//   }, []);

//   const handleGenerate = async () => {
//     if (!pdfFile || !targetRole || !duration) {
//       alert("Please provide PDF, target role, and duration");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("resume", pdfFile);
//     formData.append("targetRole", targetRole);
//     formData.append("duration", duration);
//     formData.append("careerSwitch", careerSwitch);
//     formData.append("completedSteps", JSON.stringify([]));

//     try {
//       await generate(formData);
//     } catch (error) {
//       console.error("Generation failed:", error);
//     }
//   };

//    const handleUpdate = async () => {
//     if (!pdfFile || !targetRole || !duration) {
//       alert("Please provide PDF, target role, and duration");
//       return;
//     }

//     const saved = JSON.parse(localStorage.getItem("progress")) || {};
//     const formData = new FormData();
//     formData.append("resume", pdfFile);
//     formData.append("targetRole", targetRole);
//     formData.append("duration", duration);
//     formData.append("completedSteps", JSON.stringify(Object.keys(saved).filter((k) => saved[k])));

//     try {
//       await update(formData);
//       setShowUpdateForm(false);
//     } catch (error) {
//       console.error("Update failed:", error);
//     }
//   };

//   const handleCareerSwitch = async () => {
//     if (!pdfFile || !targetRole || !duration) {
//       alert("Please provide PDF, target role, and duration");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("resume", pdfFile);
//     formData.append("targetRole", targetRole);
//     formData.append("duration", duration);
//     formData.append("currentRole", ""); // Can add input field for this

//     try {
//       await careerSwitchGenerate(formData);
//       setShowUpdateForm(false);
//     } catch (error) {
//       console.error("Career switch generation failed:", error);
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="mb-6 space-y-4">
//         <div>
//           <label className="block mb-2 text-sm font-medium">Upload Resume (PDF)</label>
//           <input
//             type="file"
//             accept=".pdf"
//             onChange={(e) => setPdfFile(e.target.files[0])}
//             className="block w-full text-sm border rounded px-3 py-2"
//             disabled={loading}
//           />
//         </div>

//         <div>
//           <label className="block mb-2 text-sm font-medium">Target Role</label>
//           <input
//             type="text"
//             value={targetRole}
//             onChange={(e) => setTargetRole(e.target.value)}
//             placeholder="e.g., Frontend Developer"
//             className="block w-full border rounded px-3 py-2"
//             disabled={loading}
//           />
//         </div>

//         <div>
//           <label className="block mb-2 text-sm font-medium">Duration</label>
//           <input
//             type="text"
//             value={duration}
//             onChange={(e) => setDuration(e.target.value)}
//             placeholder="e.g., 6 months"
//             className="block w-full border rounded px-3 py-2"
//             disabled={loading}
//           />
//         </div>

//         <label className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             checked={careerSwitch}
//             onChange={(e) => setCareerSwitch(e.target.checked)}
//             disabled={loading}
//           />
//           Career Switch Mode
//         </label>

//         <div className="flex gap-4">
//           <button
//             onClick={handleGenerate}
//             disabled={loading}
//             className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
//           >
//             {loading ? "⏳ Generating..." : "Generate Roadmap"}
//           </button>

//           <button
//             onClick={handleUpdate}
//             disabled={loading}
//             className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
//           >
//             Update Roadmap
//           </button>

//           {careerSwitch && (
//             <button
//               onClick={handleCareerSwitch}
//               disabled={loading}
//               className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
//             >
//               Generate Career Switch Plan
//             </button>
//           )}

//         </div>
//       </div>

//       {loading && (
//         <div className="bg-blue-900/30 border border-blue-500 text-blue-200 px-4 py-3 rounded mb-4">
//           <div className="flex items-center gap-3">
//             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
//             <span>Waiting for AI response... This may take a moment.</span>
//           </div>
//         </div>
//       )}

//       {error && (
//         <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
//           <p className="font-semibold mb-1">❌ Error:</p>
//           <p className="text-sm">{error}</p>
//         </div>
//       )}

//       {roadmap && roadmap.length > 0 && <Roadmap data={roadmap} />}
      
//       {!loading && !error && (!roadmap || roadmap.length === 0) && (
//         <div className="text-gray-400 text-center py-8">
//           Fill in the details and click "Generate Roadmap" to start
//         </div>
//       )}
//     </div>
//   );
// }


// import { useState, useEffect } from "react";
// import { useRoadmap } from "../hooks/useRoadmap";
// import Roadmap from "../components/Roadmap/RoadmapContainer";

// export default function RoadmapPage() {
//   const { roadmap, generate, update, careerSwitchGenerate, error, loading } = useRoadmap();
//   const [showUpdateForm, setShowUpdateForm] = useState(false);
//   const [pdfFile, setPdfFile] = useState(null);
//   const [targetRole, setTargetRole] = useState("");
//   const [duration, setDuration] = useState("");
//   const [profile, setProfile] = useState(null);

//   useEffect(() => {
//     // Load profile from localStorage or API
//     const savedProfile = localStorage.getItem("userProfile");
//     if (savedProfile) {
//       setProfile(JSON.parse(savedProfile));
//     }
//   }, []);

//   const handleGenerate = async () => {
//     if (!profile) {
//       alert("Please complete your profile first");
//       return;
//     }

//     try {
//       await generate({ profile });
//     } catch (error) {
//       console.error("Generation failed:", error);
//     }
//   };

//   const handleUpdate = async () => {
//     if (!pdfFile || !targetRole || !duration) {
//       alert("Please provide PDF, target role, and duration");
//       return;
//     }

//     const saved = JSON.parse(localStorage.getItem("progress")) || {};
//     const formData = new FormData();
//     formData.append("resume", pdfFile);
//     formData.append("targetRole", targetRole);
//     formData.append("duration", duration);
//     formData.append("completedSteps", JSON.stringify(Object.keys(saved).filter((k) => saved[k])));

//     try {
//       await update(formData);
//       setShowUpdateForm(false);
//     } catch (error) {
//       console.error("Update failed:", error);
//     }
//   };

//   const handleCareerSwitch = async () => {
//     if (!pdfFile || !targetRole || !duration) {
//       alert("Please provide PDF, target role, and duration");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("resume", pdfFile);
//     formData.append("targetRole", targetRole);
//     formData.append("duration", duration);

//     try {
//       await careerSwitchGenerate(formData);
//       setShowUpdateForm(false);
//     } catch (error) {
//       console.error("Career switch generation failed:", error);
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="mb-6 space-y-4">
//         <div className="flex gap-4">
//           <button
//             onClick={handleGenerate}
//             disabled={loading || !profile}
//             className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
//           >
//             {loading ? "⏳ Generating..." : "Generate Roadmap"}
//           </button>

//           <button
//             onClick={() => setShowUpdateForm(!showUpdateForm)}
//             disabled={loading}
//             className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
//           >
//             {showUpdateForm ? "Cancel Update" : "Update Roadmap"}
//           </button>
//         </div>

//         {showUpdateForm && (
//           <div className="border border-gray-600 rounded p-4 space-y-4">
//             <h3 className="text-lg font-semibold">Update Roadmap with Resume</h3>
            
//             <div>
//               <label className="block mb-2 text-sm font-medium">Upload Resume (PDF)</label>
//               <input
//                 type="file"
//                 accept=".pdf"
//                 onChange={(e) => setPdfFile(e.target.files[0])}
//                 className="block w-full text-sm border rounded px-3 py-2"
//                 disabled={loading}
//               />
//             </div>

//             <div>
//               <label className="block mb-2 text-sm font-medium">Target Role</label>
//               <input
//                 type="text"
//                 value={targetRole}
//                 onChange={(e) => setTargetRole(e.target.value)}
//                 placeholder="e.g., Frontend Developer"
//                 className="block w-full border rounded px-3 py-2"
//                 disabled={loading}
//               />
//             </div>

//             <div>
//               <label className="block mb-2 text-sm font-medium">Duration</label>
//               <input
//                 type="text"
//                 value={duration}
//                 onChange={(e) => setDuration(e.target.value)}
//                 placeholder="e.g., 6 months"
//                 className="block w-full border rounded px-3 py-2"
//                 disabled={loading}
//               />
//             </div>

//             <div className="flex gap-4">
//               <button
//                 onClick={handleUpdate}
//                 disabled={loading}
//                 className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
//               >
//                 Submit Update
//               </button>

//               <button
//                 onClick={handleCareerSwitch}
//                 disabled={loading}
//                 className="px-4 py-2 bg-orange-600 text-white rounded disabled:opacity-50"
//               >
//                 Career Switch Mode
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {loading && (
//         <div className="bg-blue-900/30 border border-blue-500 text-blue-200 px-4 py-3 rounded mb-4">
//           <div className="flex items-center gap-3">
//             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
//             <span>Waiting for AI response... This may take a moment.</span>
//           </div>
//         </div>
//       )}

//       {error && (
//         <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
//           <p className="font-semibold mb-1">❌ Error:</p>
//           <p className="text-sm">{error}</p>
//         </div>
//       )}

//       {roadmap && roadmap.length > 0 && <Roadmap data={roadmap} />}
      
//       {!loading && !error && (!roadmap || roadmap.length === 0) && (
//         <div className="text-gray-400 text-center py-8">
//           Click "Generate Roadmap" to start
//         </div>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import { useRoadmap } from "../hooks/useRoadmap";
import Roadmap from "../components/Roadmap/RoadmapContainer";

export default function RoadmapPage() {
  const { roadmap, generate, update, careerSwitchGenerate, error, loading } = useRoadmap();
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [duration, setDuration] = useState("");

  const handleGenerate = async () => {
    // Create a simple profile from user input or defaults
    const profile = {
      name: "User",
      targetRole: targetRole || "Software Developer",
      duration: duration || "6 months",
      resume: "Looking to advance my career in tech",
      skills: ["Programming", "Problem Solving"],
      experience: "Beginner to Intermediate"
    };

    try {
      await generate({ profile });
    } catch (error) {
      console.error("Generation failed:", error);
    }
  };

  const handleUpdate = async () => {
    if (!pdfFile || !targetRole || !duration) {
      alert("Please provide PDF, target role, and duration");
      return;
    }

    const saved = JSON.parse(localStorage.getItem("progress")) || {};
    const formData = new FormData();
    formData.append("resume", pdfFile);
    formData.append("targetRole", targetRole);
    formData.append("duration", duration);
    formData.append("completedSteps", JSON.stringify(Object.keys(saved).filter((k) => saved[k])));

    try {
      await update(formData);
      setShowUpdateForm(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleCareerSwitch = async () => {
    if (!pdfFile || !targetRole || !duration) {
      alert("Please provide PDF, target role, and duration");
      return;
    }

    const formData = new FormData();
    formData.append("resume", pdfFile);
    formData.append("targetRole", targetRole);
    formData.append("duration", duration);

    try {
      await careerSwitchGenerate(formData);
      setShowUpdateForm(false);
    } catch (error) {
      console.error("Career switch generation failed:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 space-y-4">
        {/* Quick Generate Section */}
        <div className="border border-blue-600 rounded p-4 space-y-4">
          <h3 className="text-lg font-semibold">Quick Generate Roadmap</h3>
          
          <div>
            <label className="block mb-2 text-sm font-medium">Target Role (Optional)</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g., Frontend Developer (default: Software Developer)"
              className="block w-full border rounded px-3 py-2"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Duration (Optional)</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 6 months (default: 6 months)"
              className="block w-full border rounded px-3 py-2"
              disabled={loading}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "⏳ Generating..." : "Generate Roadmap"}
          </button>
        </div>

        {/* Update Section */}
        <div className="flex gap-4">
          <button
            onClick={() => setShowUpdateForm(!showUpdateForm)}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
          >
            {showUpdateForm ? "Cancel Update" : "Update Roadmap with Resume"}
          </button>
        </div>

        {showUpdateForm && (
          <div className="border border-gray-600 rounded p-4 space-y-4">
            <h3 className="text-lg font-semibold">Update Roadmap with Resume</h3>
            
            <div>
              <label className="block mb-2 text-sm font-medium">Upload Resume (PDF)</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files[0])}
                className="block w-full text-sm border rounded px-3 py-2"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g., Frontend Developer"
                className="block w-full border rounded px-3 py-2"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 6 months"
                className="block w-full border rounded px-3 py-2"
                disabled={loading}
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
              >
                Submit Update
              </button>

              <button
                onClick={handleCareerSwitch}
                disabled={loading}
                className="px-4 py-2 bg-orange-600 text-white rounded disabled:opacity-50"
              >
                Career Switch Mode
              </button>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div className="bg-blue-900/30 border border-blue-500 text-blue-200 px-4 py-3 rounded mb-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
            <span>Waiting for AI response... This may take a moment.</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
          <p className="font-semibold mb-1">❌ Error:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {roadmap && roadmap.length > 0 && <Roadmap data={roadmap} />}
      
      {!loading && !error && (!roadmap || roadmap.length === 0) && (
        <div className="text-gray-400 text-center py-8">
          Click "Generate Roadmap" to start
        </div>
      )}
    </div>
  );
}