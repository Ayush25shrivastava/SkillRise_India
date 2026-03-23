// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

// export default function SkillChart({ skillsData = [] }) {
//   const colors = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

//   const chartData = skillsData.slice(0, 5).map(skill => ({
//     name: skill.skill.charAt(0).toUpperCase() + skill.skill.slice(1),
//     value: skill.count
//   }));

//   return (
//     <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
//       <h3 className="text-xl font-bold text-white mb-6">Top Skills Distribution</h3>
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={chartData}>
//           <XAxis dataKey="name" stroke="#ffffff40" />
//           <YAxis stroke="#ffffff40" />
//           <Tooltip
//             contentStyle={{
//               backgroundColor: "#1a1a2e",
//               border: "1px solid #ffffff20",
//               borderRadius: "8px",
//             }}
//           />
//           <Bar dataKey="value" radius={[8, 8, 0, 0]}>
//             {chartData.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
//             ))}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  PieChart,
  Pie,
  Legend,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { BarChart3, PieChart as PieIcon, TrendingUp, Activity } from "lucide-react";

const COLORS = [
  "#8b5cf6", // Purple
  "#3b82f6", // Blue
  "#10b981", // Green
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#ec4899", // Pink
  "#14b8a6", // Teal
  "#f97316", // Orange
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  
  return (
    <div className="bg-[#0a0a0f]/95 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-4 shadow-2xl">
      <p className="text-white font-bold text-base mb-2 capitalize">{data.name}</p>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-4">
          <span className="text-white/60 text-sm">Users:</span>
          <span className="text-white font-bold text-lg">{data.value}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-white/60 text-sm">Percentage:</span>
          <span className="text-emerald-400 font-bold">{data.percentage}%</span>
        </div>
      </div>
    </div>
  );
};

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="font-bold text-sm"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function SkillChart({ skillsData = [] }) {
  const [chartType, setChartType] = useState("bar"); // bar, pie, line, area
  const [animatedData, setAnimatedData] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Prepare chart data with percentages
  const chartData = skillsData.slice(0, 8).map((skill, index) => ({
    name: skill.skill.charAt(0).toUpperCase() + skill.skill.slice(1),
    value: skill.count,
    percentage: skill.percentage || 0,
    color: COLORS[index % COLORS.length],
  }));

  // Animate data on mount or when data changes
  useEffect(() => {
    setIsAnimating(true);
    setAnimatedData([]);
    
    const timer = setTimeout(() => {
      setAnimatedData(chartData);
      setIsAnimating(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [skillsData, chartType]);

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={animatedData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <defs>
                {animatedData.map((entry, index) => (
                  <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={entry.color} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={entry.color} stopOpacity={0.3} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
              <Bar
                dataKey="value"
                radius={[12, 12, 0, 0]}
                maxBarSize={60}
                animationDuration={1000}
                animationBegin={0}
              >
                {animatedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={animatedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomPieLabel}
                outerRadius={120}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                animationDuration={1000}
                animationBegin={0}
              >
                {animatedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value) => (
                  <span className="text-white/70 text-sm font-medium">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={animatedData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="name"
                tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: "#8b5cf6", r: 6 }}
                activeDot={{ r: 8 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={animatedData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="name"
                tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8b5cf6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <Activity className="w-7 h-7 text-purple-400" />
            Skills Distribution
          </h3>
          <p className="text-sm text-white/50 mt-1 font-medium">
            Real-time skill analytics across all users
          </p>
        </div>

        {/* Chart Type Selector */}
        <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-xl border border-white/10">
          <button
            onClick={() => setChartType("bar")}
            className={`p-2.5 rounded-lg transition-all ${
              chartType === "bar"
                ? "bg-purple-600 text-white shadow-lg"
                : "text-white/50 hover:text-white hover:bg-white/10"
            }`}
            title="Bar Chart"
          >
            <BarChart3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setChartType("pie")}
            className={`p-2.5 rounded-lg transition-all ${
              chartType === "pie"
                ? "bg-purple-600 text-white shadow-lg"
                : "text-white/50 hover:text-white hover:bg-white/10"
            }`}
            title="Pie Chart"
          >
            <PieIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setChartType("line")}
            className={`p-2.5 rounded-lg transition-all ${
              chartType === "line"
                ? "bg-purple-600 text-white shadow-lg"
                : "text-white/50 hover:text-white hover:bg-white/10"
            }`}
            title="Line Chart"
          >
            <TrendingUp className="w-5 h-5" />
          </button>
          <button
            onClick={() => setChartType("area")}
            className={`p-2.5 rounded-lg transition-all ${
              chartType === "area"
                ? "bg-purple-600 text-white shadow-lg"
                : "text-white/50 hover:text-white hover:bg-white/10"
            }`}
            title="Area Chart"
          >
            <Activity className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        {isAnimating && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-2xl z-10">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
          </div>
        )}
        {renderChart()}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
        {chartData.slice(0, 4).map((skill, index) => (
          <div key={index} className="text-center">
            <div
              className="w-3 h-3 rounded-full mx-auto mb-2"
              style={{ backgroundColor: skill.color }}
            ></div>
            <p className="text-white/90 font-bold text-lg">{skill.value}</p>
            <p className="text-white/50 text-xs capitalize truncate">{skill.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
