// ── Mock Users with Skills & Location ──
export const users = [
  { name: "Aarav Sharma", skills: ["html", "css"], location: "Uttar Pradesh" },
  { name: "Priya Verma", skills: ["communication", "sales"], location: "Maharashtra" },
  { name: "Ravi Kumar", skills: ["digital_literacy"], location: "Bihar" },
  { name: "Sneha Gupta", skills: ["html", "javascript"], location: "Uttar Pradesh" },
  { name: "Amit Yadav", skills: ["communication"], location: "Madhya Pradesh" },
  { name: "Pooja Singh", skills: ["digital_literacy", "html"], location: "Rajasthan" },
  { name: "Rohit Patel", skills: ["sales", "communication"], location: "Gujarat" },
  { name: "Neha Joshi", skills: ["css", "digital_literacy"], location: "Maharashtra" },
  { name: "Vikram Reddy", skills: ["javascript", "html"], location: "Telangana" },
  { name: "Ananya Das", skills: ["communication", "sales"], location: "West Bengal" },
  { name: "Suresh Nair", skills: ["digital_literacy"], location: "Kerala" },
  { name: "Kavita Thakur", skills: ["html"], location: "Madhya Pradesh" },
  { name: "Deepak Mishra", skills: ["sales"], location: "Uttar Pradesh" },
  { name: "Meera Iyer", skills: ["css", "javascript"], location: "Karnataka" },
  { name: "Arjun Chauhan", skills: ["communication", "digital_literacy"], location: "Rajasthan" },
  { name: "Lakshmi Pillai", skills: ["html", "css"], location: "Tamil Nadu" },
  { name: "Sanjay Dubey", skills: ["digital_literacy", "sales"], location: "Bihar" },
  { name: "Ritu Agarwal", skills: ["communication"], location: "Delhi" },
  { name: "Manish Tiwari", skills: ["html", "javascript"], location: "Jharkhand" },
  { name: "Divya Saxena", skills: ["sales", "digital_literacy"], location: "Punjab" },
  { name: "Kiran Rao", skills: ["communication", "css"], location: "Andhra Pradesh" },
  { name: "Nikhil Jain", skills: ["html"], location: "Chhattisgarh" },
  { name: "Swati Pandey", skills: ["digital_literacy", "communication"], location: "Uttarakhand" },
  { name: "Rajesh Gond", skills: ["sales"], location: "Odisha" },
  { name: "Fatima Sheikh", skills: ["html", "digital_literacy"], location: "Jammu & Kashmir" },
  { name: "Gaurav Meena", skills: ["communication", "css"], location: "Haryana" },
  { name: "Tanya Bose", skills: ["javascript"], location: "Assam" },
  { name: "Vivek Chandra", skills: ["html", "sales"], location: "Gujarat" },
  { name: "Parveen Kaur", skills: ["digital_literacy"], location: "Punjab" },
  { name: "Om Prakash", skills: ["communication", "html"], location: "Bihar" },
];

// ── NGOs ──
export const ngos = [
  { name: "SkillBridge Foundation", type: "Education", state: "Maharashtra", email: "info@skillbridge.org" },
  { name: "Digital India Trust", type: "Technology", state: "Delhi", email: "contact@digitrust.in" },
  { name: "Rural Uplift Initiative", type: "Community", state: "Bihar", email: "admin@ruraluplift.org" },
  { name: "Youth Empower Network", type: "Youth Development", state: "Karnataka", email: "support@yen.org.in" },
  { name: "Kaushal Vikas Sansthan", type: "Vocational Training", state: "Uttar Pradesh", email: "info@kvs.org" },
];

// ── Market Demand (out of 100 scale) ──
export const demand = {
  communication: 85,
  html: 65,
  digital_literacy: 78,
  sales: 55,
  css: 45,
  javascript: 70,
};

// ── Skill Labels for Display ──
export const SKILL_LABELS = {
  communication: "Communication",
  html: "HTML",
  digital_literacy: "Digital Literacy",
  sales: "Sales",
  css: "CSS",
  javascript: "JavaScript",
};

// ── Indian States list (for heatmap fallback) ──
export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Jammu & Kashmir", "Ladakh",
];
