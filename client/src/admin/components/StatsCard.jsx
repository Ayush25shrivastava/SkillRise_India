import { TrendingUp, Users, Building2, MapPin } from "lucide-react";

const ICON_MAP = {
  users: Users,
  ngos: Building2,
  states: MapPin,
  skill: TrendingUp,
};

const GRADIENT_MAP = {
  users: "from-violet-500/20 to-violet-600/5",
  ngos: "from-emerald-500/20 to-emerald-600/5",
  states: "from-amber-500/20 to-amber-600/5",
  skill: "from-sky-500/20 to-sky-600/5",
};

const ICON_BG = {
  users: "bg-violet-500/20 text-violet-400",
  ngos: "bg-emerald-500/20 text-emerald-400",
  states: "bg-amber-500/20 text-amber-400",
  skill: "bg-sky-500/20 text-sky-400",
};

export default function StatsCard({ type, label, value, sub }) {
  const Icon = ICON_MAP[type] || TrendingUp;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br ${GRADIENT_MAP[type]} p-6 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-white/5 group`}
    >
      {/* Glow */}
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/[0.03] blur-2xl group-hover:bg-white/[0.06] transition-all" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-2">
            {label}
          </p>
          <p className="text-4xl font-black text-white tracking-tight">
            {value}
          </p>
          {sub && (
            <p className="text-sm text-white/50 mt-1 font-medium">{sub}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${ICON_BG[type]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
