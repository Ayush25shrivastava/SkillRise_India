// ═══════════════════════════════════════════════════════════════════════════════
// Skill Gap Engine + Agent — Example Usage
// ═══════════════════════════════════════════════════════════════════════════════
// Run: node agentic-chatbot/examples/skillGapExample.js
// Requires: GOOGLE_API_KEY or GROK_API_KEY in .env

require("dotenv").config();

const { computeSkillGap } = require("../agentic-chatbot/mcp-tools/skillGapEngine");
const skillGapAgent = require("../agentic-chatbot/agents/skillGapAgent");

// ─── Example 1: Tool-only usage (no LLM, instant) ───────────────────────────
console.log("═══════════════════════════════════════════");
console.log("EXAMPLE 1: Tool-only skill gap computation");
console.log("═══════════════════════════════════════════\n");

const userSkills = ["JavaScript", "React", "Node", "MongoDB", "Git", "HTML", "CSS"];
const requiredSkills = ["React.js", "Node.js", "TypeScript", "PostgreSQL", "Docker", "Git", "CI/CD", "System Design"];

const gap = computeSkillGap(userSkills, requiredSkills);

console.log("User Skills:", userSkills);
console.log("Required Skills:", requiredSkills);
console.log("\nResult:");
console.log("  Matched:", gap.matchedSkills);
console.log("  Missing:", gap.missingSkills);
console.log(`  Gap: ${gap.gapPercentage}%`);

// ─── Example 2: Full Agent usage (Tool + LLM) ───────────────────────────────
async function runAgentExample() {
  console.log("\n═══════════════════════════════════════════");
  console.log("EXAMPLE 2: Full Agent (Tool + LLM reasoning)");
  console.log("═══════════════════════════════════════════\n");

  const result = await skillGapAgent({
    userProfile: {
      skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express", "Git", "HTML", "CSS"],
      experience: "1 year as a junior full-stack developer at a startup. Built REST APIs and React dashboards.",
      projects: [
        "E-commerce platform with MERN stack",
        "Real-time chat app with Socket.io",
        "Portfolio website with Next.js"
      ]
    },
    job: {
      role: "Senior Full-Stack Engineer",
      requiredSkills: [
        "React.js", "Node.js", "TypeScript", "PostgreSQL", "Redis",
        "Docker", "Kubernetes", "CI/CD", "System Design",
        "GraphQL", "AWS", "Git", "Testing (Jest)"
      ]
    }
  });

  console.log("\nAgent Result:");
  console.log(JSON.stringify(result, null, 2));
}

runAgentExample().catch(console.error);
