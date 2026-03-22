// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ArrowLeft, Sparkles, Flag, ChevronRight } from 'lucide-react';
// import { cn } from '../services/utils';

// /* ─────────────────────────────────────────────
//    AI Simulated Output
// ───────────────────────────────────────────── */
// const aiGeneratedRoadmap = [
//   "Internet Fundamentals",
//   "Responsive HTML & CSS",
//   "JavaScript ES6+",
//   "React Architecture",
//   "State Management",
//   "API Integration",
//   "Testing & CI/CD",
//   "System Design"
// ];

// const careerGoal = "Frontend Architect";

// const LearningRoadmap = () => {
//   const navigate = useNavigate();
//   const [visibleCount, setVisibleCount] = useState(0);

//   useEffect(() => {
//     const total = aiGeneratedRoadmap.length + 2;
//     let i = 0;
//     const timer = setInterval(() => {
//       i++;
//       setVisibleCount(i);
//       if (i >= total) clearInterval(timer);
//     }, 120);
//     return () => clearInterval(timer);
//   }, []);

//   return (
//     <div className="w-full h-full flex flex-col gap-8 px-4 md:px-8 lg:px-10 pb-10 relative">

//       {/* Background Subtle Gradient Glow */}
//       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-purple-600/5 blur-[120px] pointer-events-none rounded-full" />

//       {/* Header / Title Section */}
//       <div className="shrink-0 mt-4 flex flex-col items-center justify-center text-center">
//         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/5 border border-purple-500/10 mb-4 animate-in fade-in slide-in-from-top-4 duration-700">
//           <Sparkles size={14} className="text-purple-400" />
//           <span className="text-[10px] font-black text-purple-300/60 uppercase tracking-[0.2em]">Personalized Roadmap Locked</span>
//         </div>
//         <h1 className="text-[32px] md:text-[40px] font-bold text-white tracking-tight mb-3">
//           {careerGoal} <span className="text-white/30 font-light italic">Journey</span>
//         </h1>
//         <p className="text-[15px] md:text-[16px] text-white/50 max-w-xl leading-relaxed">
//           An AI-synthesized progression track engineered from your current profile to bridge the final gaps to senior architectural mastery.
//         </p>
//       </div>

//       {/* Roadmap Content Container */}
//       <div className="relative flex-1 w-full max-w-4xl mx-auto mt-10">

//         {/* Neon Dotted Path Spine */}
//         <div className="absolute left-1/2 top-4 bottom-8 -translate-x-1/2 w-[2px] hidden md:block overflow-visible">
//           <div className="h-full w-full border-l-2 border-dotted border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.6)] opacity-60" />
//           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent blur-[3px] animate-pulse" />
//         </div>

//         {/* Origin Node */}
//         <div className={cn(
//           "relative flex justify-center mb-24 transition-all duration-1000",
//           visibleCount >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
//         )}>
//           <div className="flex flex-col items-center">
//             <div className="w-14 h-14 rounded-2xl bg-[#0c0c14] border border-white/5 flex items-center justify-center shadow-xl relative group">
//               <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
//               <Sparkles size={20} className="text-white/20 group-hover:text-cyan-400 transition-colors" />
//             </div>
//             <p className="mt-3 text-[9px] font-black text-white/10 uppercase tracking-[0.4em]">Origin Point</p>
//           </div>
//         </div>

//         {/* Skill Modules (Zig-Zag) */}
//         <div className="space-y-6 md:space-y-0 relative">
//           {aiGeneratedRoadmap.map((skill, index) => {
//             const isEven = index % 2 === 0;
//             const isVisible = visibleCount >= index + 2;

//             return (
//               <div
//                 key={index}
//                 className={cn(
//                   "relative flex w-full transition-all duration-1000 min-h-[110px] items-center",
//                   isEven ? "justify-start md:pr-[10%]" : "justify-end md:pl-[10%]",
//                   isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
//                 )}
//                 style={{ transitionDelay: `${index * 50}ms` }}
//               >
//                 {/* Module Card */}
//                 <div className={cn(
//                   "w-full md:w-[44%] group",
//                   isEven ? "md:text-right" : "md:text-left"
//                 )}>
//                   <div className={cn(
//                     "relative p-5 md:p-6 rounded-[2rem] bg-[#0c0c14]/50 backdrop-blur-md border border-white/[0.05] transition-all duration-500 hover:bg-white/[0.08] hover:border-pink-500/30 group flex items-center gap-5 shadow-lg",
//                     isEven ? "md:flex-row-reverse" : "flex-row"
//                   )}>
//                     {/* Index Indicator */}
//                     <div className="shrink-0 w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[13px] font-black text-white/10 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/20 transition-all shadow-[inset_0_0_10px_rgba(34,211,238,0.05)]">
//                       {String(index + 1).padStart(2, '0')}
//                     </div>

//                     <div className="flex-1">
//                       <h3 className="text-[15px] md:text-[17px] font-bold text-white/80 group-hover:text-white transition-colors tracking-tight leading-tight">
//                         {skill}
//                       </h3>
//                     </div>

//                     {/* Subtle Navigation Hint */}
//                     <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:block group-hover:translate-x-0 translate-x-1">
//                       <ChevronRight size={16} className={cn("text-cyan-500/40", isEven && "rotate-180")} />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Path Marker */}
//                 <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-20">
//                   <div className="w-2.5 h-2.5 rounded-full bg-[#05050a] border-2 border-white/20 group-hover:border-cyan-500 group-hover:scale-125 transition-all duration-500 shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Objective Node */}
//         <div className={cn(
//           "relative flex justify-center mt-32 transition-all duration-1000",
//           visibleCount >= aiGeneratedRoadmap.length + 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
//         )}>
//           <div className="flex flex-col items-center">
//             <div className="relative group">
//               <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
//               <div className="relative w-20 h-20 rounded-full bg-[#0c0c14] border border-white/5 flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:border-cyan-500/30">
//                 <Flag size={28} className="text-white/20 group-hover:text-cyan-400 transition-colors drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
//               </div>
//             </div>
//             <div className="mt-8 text-center px-4">
//               <p className="text-[10px] font-black text-cyan-400/40 uppercase tracking-[0.5em] mb-2">Final Threshold</p>
//               <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">
//                 {careerGoal} <span className="text-white/30 font-light">Reached</span>
//               </h2>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default LearningRoadmap;
