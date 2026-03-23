import React from "react";
import { getSkillStats } from "../utils/calculations";
import { SKILL_LABELS } from "../utils/mockData";
import { Hammer, Users } from "lucide-react";

export default function SkillsPanel({ blogs }) {
  const stats = getSkillStats(blogs);

  return (
    <div className="bg-white/5 border border-white/10 p-8 rounded-2xl shadow-sm hover:border-blue-500/10 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <Hammer className="text-blue-500" size={24} />
        <h2 className="text-xl font-bold text-white tracking-tight">Skills Breakdown</h2>
      </div>

      <div className="space-y-4">
        {Object.entries(stats).map(([skill, count]) => (
          <div key={skill} className="flex flex-col gap-2 p-3 bg-black/20 hover:bg-black/30 border border-white/5 hover:border-white/10 rounded-xl transition-all">
            <div className="flex justify-between items-center px-1">
              <span className="text-sm font-semibold text-white/80">
                {SKILL_LABELS[skill] || skill.toUpperCase()}
              </span>
              <span className="px-2 py-0.5 text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-md flex items-center gap-1">
                <Users size={12} />
                {count} Posts
              </span>
            </div>
            {/* Simple progress bar representation */}
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                 style={{ width: `${Math.min((count / blogs.length) * 100 + 10, 100)}%` }}
               />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
