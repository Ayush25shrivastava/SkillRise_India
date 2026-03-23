// // //src/components/Roadmap/RoadmapContainer.jsx
// // import { useEffect, useState } from "react";
// // import { generateRoadmap } from "../../services/roadmapApi";
// // import Timeline from "./Timeline";

// // export default function RoadmapContainer({ profile, resume }) {
// //   const [roadmap, setRoadmap] = useState(null);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       const data = await generateRoadmap({
// //         profile,
// //         resume,
// //         targetRole: "Frontend Developer",
// //         time: "6 months",
// //       });

// //       setRoadmap(data);
// //     };

// //     fetchData();
// //   }, []);

// //   if (!roadmap) return <div className="text-white">Generating...</div>;

// //   return <Timeline roadmap={roadmap} />;
// // }

// import StepCard from "./StepCard";
// import Timeline from "./Timeline";

// export default function RoadmapContainer({ data }) {
//   if (!data || data.length === 0) {
//     return <div className="text-white">No roadmap available</div>;
//   }

//   return <Timeline roadmap={data} />;
// }

// export default function Timeline({ roadmap }) {

//   const phases = Array.isArray(roadmap)
//     ? roadmap
//     : roadmap?.roadmap || [];

//   if (phases.length === 0) {
//     return <div className="text-white">No roadmap available</div>;
//   }

//   return (
//     <div>
//       {phases.map((phase, index) => (
//         <div key={index}>
//           <h2>{phase.phase}</h2>

//           {phase.steps?.map((step, i) => (
//             <StepCard key={i} step={step} />
//           ))}

//         </div>
//       ))}
//     </div>
//   );
// }

import Timeline from "./Timeline";

export default function RoadmapContainer({ data }) {
  if (!data || data.length === 0) {
    return <div className="text-white">No roadmap available</div>;
  }

  return <Timeline roadmap={data} />;
}
