// import StepCard from "./StepCard";
// export default function Timeline({ roadmap }) {

//     const phases = Array.isArray(roadmap)
//     ? roadmap
//     : roadmap?.roadmap || [];

//   if (phases.length === 0) {
//     return <div className="text-white">No roadmap available</div>;
//   }
//  console.log("Roadmap data in Timeline:", phases);
//   return (
//     <div>
//       {phases.map((phase, index) => (
//         <div key={index}>
//           <h2>{phase.phase}</h2>

//           {phase.steps.map((step, i) => (
//             <StepCard key={i} step={step} />
//           ))}

//         </div>
//       ))}
//     </div>
//   );
// }


import StepCard from "./StepCard";

export default function Timeline({ roadmap }) {
  const phases = Array.isArray(roadmap) ? roadmap : [];

  if (phases.length === 0) {
    return <div className="text-white">No roadmap available</div>;
  }

  return (
    <div className="relative px-4 py-8">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-700"></div>
      
      {phases.map((phase, index) => (
        <div key={index} className="relative mb-8 ml-16">
          <div className="absolute -left-[34px] top-2 w-4 h-4 rounded-full bg-blue-500 border-4 border-gray-900"></div>
          
          <div className="inline-block px-3 py-1 mb-2 text-sm font-semibold text-blue-400 bg-blue-900/30 rounded">
            Month {phase.month}
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">{phase.title}</h2>
          
          <StepCard step={phase} />
        </div>
      ))}
    </div>
  );
}
