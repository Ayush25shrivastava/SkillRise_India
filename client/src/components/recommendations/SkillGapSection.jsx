import React from "react";
import { TrendingUp, AlertTriangle } from "lucide-react";

const SkillGapSection = ({ insights }) => {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="bg-white/5 border border-white/[0.08] rounded-[2.5rem] p-10 mt-12 overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:scale-110 transition-transform duration-700">
        <TrendingUp size={120} />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
        <div className="w-16 h-16 rounded-[2rem] bg-amber-500/20 border border-amber-500/20 flex items-center justify-center text-amber-500 flex-shrink-0 animate-pulse">
          <AlertTriangle size={24} />
        </div>

        <div className="flex-1 space-y-4">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase whitespace-pre line-clamp-1">
              ⚡ Skills to <span className="text-white/40">Initialize</span>
            </h2>
            <p className="text-xs font-bold text-white/30 uppercase tracking-widest max-w-md">
              Focus on these latent vectors to unlock secondary career trajectories.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-6 justify-center md:justify-start">
            {insights.map((skill, index) => (
              <div 
                key={index}
                className="px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] text-xs font-black text-white/60 hover:text-white uppercase tracking-widest transition-all cursor-default"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block w-px h-24 bg-white/[0.06]" />

        <div className="hidden lg:block p-8 bg-white/5 rounded-3xl border border-white/[0.03]">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block mb-2">Priority Focus</span>
          <p className="text-xl font-bold text-white tracking-tight">{insights[0]}</p>
        </div>
      </div>
    </div>
  );
};

export default SkillGapSection;
