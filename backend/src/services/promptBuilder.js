export const buildRoadmapPrompt = ({
  profile,
  resumeText,
  targetRole,
  duration,
  completedSteps = [],
  careerSwitch = false,
}) => {
  return `
You are an expert AI career mentor.

USER DATA:
Profile: ${JSON.stringify(profile)}
Resume: ${resumeText}

Target Role: ${targetRole}
Time Available: ${duration}

Completed Steps: ${JSON.stringify(completedSteps)}

Career Switch Mode: ${careerSwitch}

INSTRUCTIONS:

1. Analyze:
- Strong skills
- Weak skills
- Missing industry skills

2. Detect:
- Weak projects
- Irrelevant resume parts

3. Generate a timeline roadmap:
- Month-wise
- Adaptive (skip completed steps)
- If career switch = true → add transition phase

4. Each step MUST include:
- title
- skills
- tools
- tasks (real-world tasks)
- outcome
- resources:
   - free (YouTube structured)
   - paid (Coursera/Udemy)
   - practice (LeetCode/Kaggle)

5. Suggest resume improvements:
- Add projects
- Fix sections

RETURN STRICT JSON:

{
  "analysis": {
    "strong": [],
    "weak": [],
    "missing": []
  },
  "roadmap": [],
  "resume_improvements": []
}
`;
};