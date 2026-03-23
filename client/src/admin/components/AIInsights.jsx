// client/src/admin/components/AIInsights.jsx
import { useState, useEffect } from "react";
import { Brain, AlertTriangle, CheckCircle, Info, AlertCircle, Sparkles, Clock } from "lucide-react";

const TYPE_CONFIG = {
  critical: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    icon: AlertTriangle,
    iconColor: "text-red-400",
    glow: "shadow-red-500/20"
  },
  warning: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: AlertCircle,
    iconColor: "text-amber-400",
    glow: "shadow-amber-500/20"
  },
  success: {
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    icon: CheckCircle,
    iconColor: "text-green-400",
    glow: "shadow-green-500/20"
  },
  info: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    icon: Info,
    iconColor: "text-blue-400",
    glow: "shadow-blue-500/20"
  }
};

export default function AIInsights({ insights = [] }) {
  const [visibleInsights, setVisibleInsights] = useState([]);

  useEffect(() => {
    // Animate insights appearing one by one
    insights.forEach((insight, index) => {
      setTimeout(() => {
        setVisibleInsights(prev => [...prev, insight]);
      }, index * 200);
    });
  }, [insights]);

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight">
              AI Insights
            </h3>
            <p className="text-xs text-white/40">Powered by Gemini AI</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20">
          <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
          <span className="text-xs font-bold text-purple-400">AI Generated</span>
        </div>
      </div>

      <div className="space-y-4">
        {visibleInsights.map((insight, index) => {
          const config = TYPE_CONFIG[insight.type] || TYPE_CONFIG.info;
          const IconComponent = config.icon;

          return (
            <div
              key={`${insight.id}-${index}`}  // ← Add index to ensure uniqueness
              className={`group relative p-5 rounded-2xl border ${config.bg} ${config.border} hover:scale-[1.02] transition-all duration-300 ${config.glow} hover:shadow-xl`}
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Priority Badge */}
              {insight.priority === 'high' && (
                <div className="absolute -top-2 -right-2 px-2 py-1 rounded-lg bg-red-500 text-white text-[10px] font-black uppercase shadow-lg animate-bounce">
                  High Priority
                </div>
              )}

              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl ${config.bg} border ${config.border} flex items-center justify-center shrink-0`}>
                  <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-bold text-sm">{insight.title}</h4>
                    {insight.timestamp && (
                      <div className="flex items-center gap-1 text-white/40">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">{getTimeAgo(insight.timestamp)}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {insight.text}
                  </p>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          );
        })}
      </div>

      
    </div>
  );
}
