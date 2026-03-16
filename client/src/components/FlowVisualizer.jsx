// import ReactFlow, { Background } from "reactflow";
// import "reactflow/dist/style.css";

// const nodeStyle = {
//   borderRadius: "12px",
//   padding: "12px",
//   color: "white",
//   border: "none",
//   fontWeight: "600",
//   boxShadow: "0 0 20px rgba(0,0,0,0.4)"
// };

// const nodes = [
//   {
//     id: "1",
//     position: { x: 0, y: 0 },
//     data: { label: "Upload Resume" },
//     style: { ...nodeStyle, background: "#3b82f6" }
//   },
//   {
//     id: "2",
//     position: { x: 220, y: 0 },
//     data: { label: "Parse Resume" },
//     style: { ...nodeStyle, background: "#6366f1" }
//   },
//   {
//     id: "3",
//     position: { x: 440, y: 0 },
//     data: { label: "Extract Skills" },
//     style: { ...nodeStyle, background: "#8b5cf6" }
//   },
//   {
//     id: "4",
//     position: { x: 660, y: 0 },
//     data: { label: "ATS Score" },
//     style: { ...nodeStyle, background: "#22c55e" }
//   },
//   {
//     id: "5",
//     position: { x: 880, y: 0 },
//     data: { label: "Suggestions" },
//     style: { ...nodeStyle, background: "#f59e0b" }
//   }
// ];

// const edges = [
//   {
//     id: "e1",
//     source: "1",
//     target: "2",
//     animated: true,
//     style: { stroke: "#60a5fa", strokeWidth: 3 }
//   },
//   {
//     id: "e2",
//     source: "2",
//     target: "3",
//     animated: true,
//     style: { stroke: "#818cf8", strokeWidth: 3 }
//   },
//   {
//     id: "e3",
//     source: "3",
//     target: "4",
//     animated: true,
//     style: { stroke: "#34d399", strokeWidth: 3 }
//   },
//   {
//     id: "e4",
//     source: "4",
//     target: "5",
//     animated: true,
//     style: { stroke: "#fbbf24", strokeWidth: 3 }
//   }
// ];

// export default function FlowVisualizer() {
//   return (
//     <div className="w-full h-[180px]">
//       <ReactFlow nodes={nodes} edges={edges} fitView>
//         <Background gap={16} color="#1e293b" />
//       </ReactFlow>
//     </div>
//   );
// }

import ReactFlow, { Background } from "reactflow";
import "reactflow/dist/style.css";

const nodeStyle = {
  borderRadius: "14px",
  padding: "14px 20px",
  fontWeight: "600",
  color: "white",
  border: "1px solid rgba(255,255,255,0.1)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 0 20px rgba(59,130,246,0.4)"
};

const nodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: { label: "Upload Resume" },
    style: { ...nodeStyle, background: "linear-gradient(135deg,#3b82f6,#2563eb)" }
  },
  {
    id: "2",
    position: { x: 260, y: 0 },
    data: { label: "Parse Resume" },
    style: { ...nodeStyle, background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }
  },
  {
    id: "3",
    position: { x: 520, y: 0 },
    data: { label: "Extract Skills" },
    style: { ...nodeStyle, background: "linear-gradient(135deg,#8b5cf6,#a855f7)" }
  },
  {
    id: "4",
    position: { x: 780, y: 0 },
    data: { label: "ATS Score" },
    style: { ...nodeStyle, background: "linear-gradient(135deg,#22c55e,#16a34a)" }
  },
  {
    id: "5",
    position: { x: 1040, y: 0 },
    data: { label: "Suggestions" },
    style: { ...nodeStyle, background: "linear-gradient(135deg,#f59e0b,#d97706)" }
  }
];

const edges = [
  { id: "e1", source: "1", target: "2", animated: true, style: { stroke: "#60a5fa", strokeWidth: 3 } },
  { id: "e2", source: "2", target: "3", animated: true, style: { stroke: "#a78bfa", strokeWidth: 3 } },
  { id: "e3", source: "3", target: "4", animated: true, style: { stroke: "#4ade80", strokeWidth: 3 } },
  { id: "e4", source: "4", target: "5", animated: true, style: { stroke: "#fbbf24", strokeWidth: 3 } }
];

export default function FlowVisualizer() {
  return (
    <div className="w-full h-[260px]">
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background gap={20} color="#1e293b" />
      </ReactFlow>
    </div>
  );
}