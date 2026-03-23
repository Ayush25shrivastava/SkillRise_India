import React from "react";
import { getImpactMetrics } from "../utils/calculations";
import { TrendingUp, BarChart3, Users, Globe, Flame } from "lucide-react";

export default function ImpactPanel({ blogs }) {
  const metrics = getImpactMetrics(blogs);

  return (
    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-sm hover:border-blue-500/20 transition-all duration-300 relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-8 text-blue-500/10 group-hover:text-blue-500/20 transition-all duration-300 rotate-12 -mr-8 -mt-8">
         <Flame size={120} />
      </div>

      <div className="flex items-center gap-3 mb-8 relative z-10">
        <TrendingUp className="text-blue-500" size={24} />
        <h2 className="text-xl font-bold text-white tracking-tight">Impact Statistics</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        <div className="p-6 bg-black/30 border border-white/5 hover:border-blue-500/30 rounded-2xl transition-all duration-300">
           <div className="flex items-center gap-3 mb-2">
             <BarChart3 className="text-blue-500/60" size={18} />
             <span className="text-sm font-medium text-white/50 uppercase tracking-widest">Total Posts</span>
           </div>
           <div className="text-4xl font-black text-white tracking-tight">{metrics.totalPosts}</div>
        </div>

        <div className="p-6 bg-black/30 border border-white/5 hover:border-blue-500/30 rounded-2xl transition-all duration-300">
           <div className="flex items-center gap-3 mb-2">
             <Users className="text-blue-500/60" size={18} />
             <span className="text-sm font-medium text-white/50 uppercase tracking-widest">Skills Covered</span>
           </div>
           <div className="text-4xl font-black text-white tracking-tight">{metrics.skillsCount}</div>
        </div>

        <div className="p-6 bg-black/30 border border-white/5 hover:border-blue-500/30 rounded-2xl transition-all duration-300">
           <div className="flex items-center gap-3 mb-2">
             <Globe className="text-blue-500/60" size={18} />
             <span className="text-sm font-medium text-white/50 uppercase tracking-widest">Active Regions</span>
           </div>
           <div className="text-4xl font-black text-white tracking-tight">{metrics.regionsCount}</div>
        </div>
      </div>
    </div>
  );
}
