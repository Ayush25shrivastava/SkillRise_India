import React from "react";
import { Briefcase, PlayCircle, Star, ArrowUpRight } from "lucide-react";

const RecommendationCard = ({ recommendation }) => {
  const { title, type, match_score, matched_skills, missing_skills, reason } = recommendation;

  return (
    <div className="bg-white/5 border border-white/[0.08] rounded-3xl p-6 shadow-xl hover:bg-white/[0.08] hover:scale-[1.02] transform transition-all duration-300 group">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/10">
          {type === "job" ? <Briefcase size={22} /> : <PlayCircle size={22} />}
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
          <Star size={14} fill="currentColor" />
          {match_score}% Match
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-white/90 transition-colors">
          {title}
        </h3>
        
        <p className="text-white/40 text-sm font-medium leading-relaxed">
          {reason}
        </p>

        {/* Skills Section */}
        <div className="pt-4 space-y-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 block mb-2">Matched Skills</span>
            <div className="flex flex-wrap gap-2">
              {matched_skills.map((skill, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/10">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 block mb-2">Missing To Grow</span>
            <div className="flex flex-wrap gap-2">
              {missing_skills.map((skill, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-white/5 text-white/30 text-[10px] font-bold border border-white/5 line-through decoration-white/10">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <button className="mt-8 w-full group/btn relative overflow-hidden bg-white hover:bg-white/90 text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3">
        <span className="relative z-10">{type === "job" ? "Apply Now" : "Enroll Now"}</span>
        <ArrowUpRight size={16} className="relative z-10 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
      </button>
    </div>
  );
};

export default RecommendationCard;
