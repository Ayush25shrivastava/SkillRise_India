import { getInsights } from "../utils/calculations";

const TYPE_STYLES = {
  critical: "border-red-500/20 bg-red-500/[0.04]",
  warning: "border-amber-500/20 bg-amber-500/[0.04]",
  info: "border-sky-500/20 bg-sky-500/[0.04]",
  success: "border-emerald-500/20 bg-emerald-500/[0.04]",
};

export default function Insights() {
  const insights = getInsights();

  return (
    <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8">
      <h3 className="text-lg font-black text-white uppercase tracking-tight mb-6">
        🧠 AI Insights
      </h3>
      <div className="space-y-4">
        {insights.map((insight, i) => (
          <div
            key={i}
            className={`flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.01] ${TYPE_STYLES[insight.type]}`}
          >
            <span className="text-2xl shrink-0 mt-0.5">{insight.icon}</span>
            <p className="text-sm text-white/80 font-medium leading-relaxed">
              {insight.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
