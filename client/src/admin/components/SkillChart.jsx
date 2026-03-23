import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  Legend,
} from "recharts";
import { getSkillGaps } from "../utils/calculations";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl px-5 py-4 shadow-2xl">
      <p className="text-white font-bold text-sm mb-2">{d.label}</p>
      <div className="space-y-1 text-xs">
        <p className="text-sky-400">Demand: <span className="text-white font-bold">{d.demand}</span></p>
        <p className="text-emerald-400">Supply: <span className="text-white font-bold">{d.supply}</span></p>
        <p className="text-red-400">Gap: <span className="text-white font-bold">{d.gap}</span></p>
      </div>
    </div>
  );
};

export default function SkillChart() {
  const data = getSkillGaps().sort((a, b) => b.gap - a.gap);

  return (
    <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-black text-white uppercase tracking-tight">
            Skill Gap Analysis
          </h3>
          <p className="text-xs text-white/40 mt-1">Demand vs Supply across all skills</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} barGap={8} barCategoryGap="20%">
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600 }}
            axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Legend
            wrapperStyle={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}
          />
          <Bar dataKey="demand" name="Market Demand" radius={[8, 8, 0, 0]} maxBarSize={40}>
            {data.map((entry, i) => (
              <Cell key={i} fill="rgba(56, 189, 248, 0.7)" />
            ))}
          </Bar>
          <Bar dataKey="supply" name="User Supply" radius={[8, 8, 0, 0]} maxBarSize={40}>
            {data.map((entry, i) => (
              <Cell key={i} fill="rgba(52, 211, 153, 0.7)" />
            ))}
          </Bar>
          <Bar dataKey="gap" name="Gap" radius={[8, 8, 0, 0]} maxBarSize={40}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={
                  entry.gap > 60
                    ? "rgba(239, 68, 68, 0.8)"
                    : entry.gap > 30
                    ? "rgba(245, 158, 11, 0.8)"
                    : "rgba(34, 197, 94, 0.7)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
