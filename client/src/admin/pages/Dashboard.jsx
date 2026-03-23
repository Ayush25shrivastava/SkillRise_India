import StatsCard from "../components/StatsCard";
import Heatmap from "../components/Heatmap";
import SkillChart from "../components/SkillChart";
import Insights from "../components/Insights";
import TrendingSkills from "../components/TrendingSkills";
import { users, ngos } from "../utils/mockData";
import { getStateAnalytics, getTrendingSkills } from "../utils/calculations";

export default function Dashboard() {
  const stateData = getStateAnalytics();
  const topSkill = getTrendingSkills(1)[0];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-sm text-white/40 mt-1 font-medium">
          Real-time overview of SkillRise across India
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          type="users"
          label="Total Users"
          value={users.length}
          sub="Across all states"
        />
        <StatsCard
          type="ngos"
          label="Registered NGOs"
          value={ngos.length}
          sub="Partner organizations"
        />
        <StatsCard
          type="states"
          label="Active States"
          value={stateData.length}
          sub="With user presence"
        />
        <StatsCard
          type="skill"
          label="Top Demand Skill"
          value={topSkill?.label || "—"}
          sub={`${topSkill?.demand || 0}% market demand`}
        />
      </div>

      {/* India Heatmap – Full Width */}
      <Heatmap />

      {/* Charts + Side panels */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8">
          <SkillChart />
        </div>
        <div className="xl:col-span-4 space-y-8">
          <TrendingSkills />
        </div>
      </div>

      {/* Insights */}
      <Insights />
    </div>
  );
}
