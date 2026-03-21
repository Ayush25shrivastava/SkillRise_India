import { cn } from "../../utils/helpers";

export default function ScoreRing({ score, size = 120, strokeWidth = 10, className }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = ((score || 0) / 100) * circumference;
  const offset = circumference - progress;

  const color =
    score >= 80 ? "#34d399" : score >= 60 ? "#fbbf24" : "#f87171";

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground" style={{ color }}>
          {score ?? "—"}
        </span>
        <span className="text-xs text-muted-foreground">/100</span>
      </div>
    </div>
  );
}
