export const USER_CATEGORIES = [
  { value: "white-collar", label: "White Collar", icon: "💼", description: "Corporate & office roles" },
  { value: "blue-collar", label: "Blue Collar", icon: "🛠️", description: "Skilled trades & operations" },
  { value: "student", label: "Student", icon: "🎓", description: "Entry-level & internships" },
];

export const INTERVIEW_TYPES = [
  { value: "technical", label: "Technical", icon: "💻", description: "Coding & skill-based questions" },
  { value: "behavioral", label: "Behavioral", icon: "🧠", description: "Soft skills & culture fit" },
  { value: "situational", label: "Situational", icon: "🚨", description: "Handling specific scenarios" },
  { value: "mixed", label: "Mixed", icon: "⚡", description: "Technical + behavioral" },
];

export const CATEGORY_TYPES = {
  "white-collar": ["technical", "behavioral", "mixed"],
  "student": ["technical", "behavioral", "mixed"],
  "blue-collar": ["situational", "behavioral"],
};

export const EXPERIENCE_LEVELS = [
  { value: "junior", label: "Junior", years: "0–2 years" },
  { value: "mid", label: "Mid-level", years: "2–5 years" },
  { value: "senior", label: "Senior", years: "5+ years" },
];

export const TECH_STACK_OPTIONS = [
  // Frontend
  "React", "Next.js", "Vue.js", "Angular", "Svelte", "TypeScript", "JavaScript",
  "HTML/CSS", "Tailwind CSS", "Redux",
  // Backend
  "Node.js", "Express", "NestJS", "FastAPI", "Django", "Flask", "Spring Boot",
  "GraphQL", "REST APIs", "tRPC",
  // Databases
  "MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase", "Supabase",
  "Prisma", "Mongoose", "SQLite",
  // DevOps & Cloud
  "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Vercel", "Railway",
  "CI/CD", "GitHub Actions", "Terraform",
  // Mobile
  "React Native", "Flutter", "Swift", "Kotlin",
  // Trades/Operations (for Blue Collar)
  "Electrical Maintenance", "Carpentry", "Plumbing", "Warehouse Ops", "Logistics",
  "Safety Protocols", "Machine Op", "HVAC", "Inventory Management",
  // Other
  "Python", "Go", "Rust", "Java", "C#", "PHP",
  "Git", "Linux", "Microservices", "System Design",
];

export const QUESTION_COUNTS = [3, 5, 7, 10];

export const SCORE_COLOR = (score) => {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-red-400";
};

export const SCORE_BG = (score) => {
  if (score >= 80) return "bg-emerald-400/10 border-emerald-400/30";
  if (score >= 60) return "bg-amber-400/10 border-amber-400/30";
  return "bg-red-400/10 border-red-400/30";
};

export const TYPE_COLOR = {
  technical: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  behavioral: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  situational: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  mixed: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

export const LEVEL_COLOR = {
  junior: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  mid: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  senior: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};
