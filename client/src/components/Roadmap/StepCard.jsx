// import { useState, useEffect } from "react";

// export default function StepCard({ step }) {
//   const [done, setDone] = useState(false);

//   useEffect(() => {
//     const saved = JSON.parse(localStorage.getItem("progress")) || {};
//     setDone(saved[step.title] || false);
//   }, []);

//   const toggle = () => {
//     const updated = !done;
//     setDone(updated);

//     const saved = JSON.parse(localStorage.getItem("progress")) || {};
//     saved[step.title] = updated;

//     localStorage.setItem("progress", JSON.stringify(saved));
//   };

//   return (
//     <div className="card">
//       <div className="flex justify-between">
//         <h3 className="font-semibold">{step.title}</h3>
//         <input type="checkbox" checked={done} onChange={toggle} />
//       </div>

//       <p className="text-sm mt-2">Skills: {step.skills.join(", ")}</p>

//       <ul className="mt-2 text-sm">
//         {step.tasks.map((t, i) => (
//           <li key={i}>• {t}</li>
//         ))}
//       </ul>

//       <p className="text-green-400 mt-2">{step.outcome}</p>
//     </div>
//   );
// }

import { useState, useEffect } from "react";

export default function StepCard({ step }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("progress")) || {};
    setDone(saved[step.title] || false);
  }, [step.title]);

  const toggle = () => {
    const updated = !done;
    setDone(updated);

    const saved = JSON.parse(localStorage.getItem("progress")) || {};
    saved[step.title] = updated;
    localStorage.setItem("progress", JSON.stringify(saved));
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white">{step.title}</h3>
        <input 
          type="checkbox" 
          checked={done} 
          onChange={toggle}
          className="w-5 h-5 cursor-pointer"
        />
      </div>

      {step.skills && (
        <div className="mb-3">
          <p className="text-sm font-semibold text-gray-400 mb-1">Skills:</p>
          <p className="text-sm text-white">{step.skills.join(", ")}</p>
        </div>
      )}

      {step.tools && (
        <div className="mb-3">
          <p className="text-sm font-semibold text-gray-400 mb-1">Tools:</p>
          <p className="text-sm text-white">{step.tools.join(", ")}</p>
        </div>
      )}

      {step.tasks && (
        <div className="mb-3">
          <p className="text-sm font-semibold text-gray-400 mb-1">Tasks:</p>
          <ul className="text-sm text-white space-y-1">
            {step.tasks.map((t, i) => (
              <li key={i}>• {t}</li>
            ))}
          </ul>
        </div>
      )}

      {step.outcome && (
        <p className="text-green-400 mt-3 text-sm font-medium">{step.outcome}</p>
      )}
    </div>
  );
}
