// client/src/admin/components/PolicyRecommender.jsx
import { useState } from "react";
import { FileText, Target, Clock, DollarSign, MapPin, TrendingUp, ChevronDown, ChevronUp, Sparkles, CheckCircle } from "lucide-react";

const PRIORITY_CONFIG = {
  high: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    badge: "bg-red-500",
    text: "text-red-400"
  },
  medium: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    badge: "bg-amber-500",
    text: "text-amber-400"
  },
  low: {
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    badge: "bg-green-500",
    text: "text-green-400"
  }
};

const CATEGORY_COLORS = {
  "Skill Development": "from-purple-500 to-pink-500",
  "Infrastructure": "from-blue-500 to-cyan-500",
  "Partnership": "from-green-500 to-emerald-500",
  "Technology": "from-orange-500 to-red-500",
  "Employment": "from-indigo-500 to-purple-500"
};

export default function PolicyRecommender({ recommendations = [] }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight">
              Policy Recommendations
            </h3>
            <p className="text-xs text-white/40">AI-powered strategic insights</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
          <Sparkles className="w-3 h-3 text-blue-400 animate-pulse" />
          <span className="text-xs font-bold text-blue-400">AI Analysis</span>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, index) => {
          const isExpanded = expandedId === rec.id;
          const priorityConfig = PRIORITY_CONFIG[rec.priority] || PRIORITY_CONFIG.medium;
          const categoryGradient = CATEGORY_COLORS[rec.category] || "from-gray-500 to-gray-600";

          return (
            <div
              key={rec.id}
              className={`group relative rounded-2xl border ${priorityConfig.border} ${priorityConfig.bg} overflow-hidden transition-all duration-300 hover:shadow-xl`}
              style={{
                animation: `slideInRight 0.5s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Header - Always Visible */}
              <div
                className="p-5 cursor-pointer"
                onClick={() => toggleExpand(rec.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryGradient} flex items-center justify-center text-2xl shrink-0 shadow-lg`}>
                    {rec.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-bold text-base">{rec.title}</h4>
                          <span className={`px-2 py-0.5 rounded-full ${priorityConfig.badge} text-white text-[10px] font-black uppercase`}>
                            {rec.priority}
                          </span>
                        </div>
                        <p className="text-xs text-white/50 font-semibold uppercase tracking-wider">
                          {rec.category}
                        </p>
                      </div>
                      <button className="text-white/60 hover:text-white transition-colors">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <p className="text-sm text-white/70 leading-relaxed line-clamp-2">
                      {rec.description}
                    </p>

                    {/* Quick Stats */}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-white/40" />
                        <span className="text-xs text-white/60 font-semibold">{rec.impact} Impact</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-white/40" />
                        <span className="text-xs text-white/60 font-semibold">{rec.timeline}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-white/40" />
                        <span className="text-xs text-white/60 font-semibold">{rec.budget}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div
                  className="px-5 pb-5 border-t border-white/10"
                  style={{
                    animation: "expandDown 0.3s ease-out"
                  }}
                >
                  <div className="pt-4 space-y-4">
                    {/* Full Description */}
                    <div>
                      <h5 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">
                        Detailed Plan
                      </h5>
                      <p className="text-sm text-white/80 leading-relaxed">
                        {rec.description}
                      </p>
                    </div>

                    {/* Target States */}
                    {rec.states && rec.states.length > 0 && (
                      <div>
                        <h5 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5" />
                          Target States
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {rec.states.map((state, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-white/80 font-semibold"
                            >
                              {state}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Metrics */}
                    {rec.metrics && (
                      <div>
                        <h5 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <TrendingUp className="w-3.5 h-3.5" />
                          Key Metrics
                        </h5>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(rec.metrics).map(([key, value], i) => (
                            <div
                              key={i}
                              className="p-3 rounded-xl bg-white/5 border border-white/10"
                            >
                              <p className="text-xs text-white/50 mb-1 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </p>
                              <p className="text-base font-black text-white">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <button className={`w-full py-3 rounded-xl bg-gradient-to-r ${categoryGradient} text-white font-bold text-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2`}>
                      <CheckCircle className="w-4 h-4" />
                      Implement Policy
                    </button>
                  </div>
                </div>
              )}

              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          );
        })}
      </div>

      
    </div>
  );
}
