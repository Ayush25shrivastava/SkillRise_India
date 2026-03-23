export function getSkillStats(blogs) {
  const stats = {};
  blogs.forEach((blog) => {
    blog.skills.forEach((skill) => {
      stats[skill] = (stats[skill] || 0) + 1;
    });
  });
  return stats;
}

export function getTrendingSkills(blogs, limit = 3) {
  const stats = getSkillStats(blogs);
  return Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([skill, count]) => ({ skill, count }));
}

export function generateSuggestions(blogs, allPossibleSkills) {
  const stats = getSkillStats(blogs);
  const suggestions = [];

  // Suggest skills with zero or low postings (e.g., < 2)
  allPossibleSkills.forEach((skill) => {
    const count = stats[skill] || 0;
    if (count < 2) {
      suggestions.push(`Post more about ${skill.replace(/_/g, " ").toUpperCase()}`);
    }
  });

  return suggestions;
}

export function getImpactMetrics(blogs) {
  const totalPosts = blogs.length;
  const skillsCount = new Set(blogs.flatMap((b) => b.skills)).size;
  const regionsCount = new Set(blogs.map((b) => b.region)).size;

  return {
    totalPosts,
    skillsCount,
    regionsCount,
  };
}
