import { users, demand, SKILL_LABELS } from "./mockData";

/**
 * Count how many users have each skill (supply side)
 */
export function getSkillSupply() {
  const supply = {};
  users.forEach((u) => {
    u.skills.forEach((s) => {
      supply[s] = (supply[s] || 0) + 1;
    });
  });
  return supply;
}

/**
 * Calculate gap = demand - supply for each skill
 */
export function getSkillGaps() {
  const supply = getSkillSupply();
  return Object.keys(demand).map((skill) => ({
    skill,
    label: SKILL_LABELS[skill] || skill,
    demand: demand[skill],
    supply: supply[skill] || 0,
    gap: demand[skill] - (supply[skill] || 0),
  }));
}

/**
 * Group users by location (state)
 */
export function getUsersByState() {
  const stateMap = {};
  users.forEach((u) => {
    if (!stateMap[u.location]) {
      stateMap[u.location] = { users: [], skillCount: {} };
    }
    stateMap[u.location].users.push(u);
    u.skills.forEach((s) => {
      stateMap[u.location].skillCount[s] =
        (stateMap[u.location].skillCount[s] || 0) + 1;
    });
  });
  return stateMap;
}

/**
 * For each state, compute: total users, top skills, missing skills, gap score
 */
export function getStateAnalytics() {
  const stateMap = getUsersByState();
  const allSkills = Object.keys(demand);

  return Object.entries(stateMap).map(([state, data]) => {
    const topSkills = Object.entries(data.skillCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([s]) => SKILL_LABELS[s] || s);

    const presentSkills = Object.keys(data.skillCount);
    const missingSkills = allSkills
      .filter((s) => !presentSkills.includes(s))
      .map((s) => SKILL_LABELS[s] || s);

    // Gap = average demand for missing skills
    const missingDemandValues = allSkills
      .filter((s) => !presentSkills.includes(s))
      .map((s) => demand[s]);
    const avgGap =
      missingDemandValues.length > 0
        ? Math.round(
            missingDemandValues.reduce((a, b) => a + b, 0) /
              missingDemandValues.length
          )
        : 0;

    // Weighted gap considers both missing skills AND undersupplied skills
    const totalGap = allSkills.reduce((sum, s) => {
      const supplied = data.skillCount[s] || 0;
      const needed = Math.ceil(demand[s] / 20); // normalize demand to expected per-state count
      return sum + Math.max(0, needed - supplied);
    }, 0);

    return {
      state,
      totalUsers: data.users.length,
      topSkills,
      missingSkills,
      avgGap,
      totalGap,
      gapLevel: totalGap > 4 ? "Critical" : totalGap > 2 ? "Moderate" : "Low",
      gapColor:
        totalGap > 4 ? "#ef4444" : totalGap > 2 ? "#f59e0b" : "#22c55e",
    };
  });
}

/**
 * Generate auto insights from the data
 */
export function getInsights() {
  const gaps = getSkillGaps();
  const stateData = getStateAnalytics();
  const insights = [];

  // Highest gap skill
  const highestGap = gaps.sort((a, b) => b.gap - a.gap)[0];
  if (highestGap) {
    insights.push({
      icon: "🔴",
      type: "critical",
      text: `${highestGap.label} has the highest skill gap (demand: ${highestGap.demand}, supply: ${highestGap.supply}).`,
    });
  }

  // State with highest shortage
  const worstState = stateData.sort((a, b) => b.totalGap - a.totalGap)[0];
  if (worstState) {
    insights.push({
      icon: "📍",
      type: "warning",
      text: `${worstState.state} has the highest skill shortage with ${worstState.missingSkills.length} missing skill areas.`,
    });
  }

  // Rising demand
  const risingSkill = gaps.sort((a, b) => b.demand - a.demand)[0];
  if (risingSkill) {
    insights.push({
      icon: "📈",
      type: "info",
      text: `${risingSkill.label} has the highest market demand at ${risingSkill.demand}% — prioritize training programs.`,
    });
  }

  // Coverage stat
  const coveredStates = stateData.length;
  insights.push({
    icon: "🗺️",
    type: "success",
    text: `SkillRise currently has user presence across ${coveredStates} states and union territories.`,
  });

  return insights;
}

/**
 * Get top N trending skills by demand
 */
export function getTrendingSkills(n = 3) {
  return Object.entries(demand)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([skill, value]) => ({
      skill,
      label: SKILL_LABELS[skill] || skill,
      demand: value,
    }));
}
