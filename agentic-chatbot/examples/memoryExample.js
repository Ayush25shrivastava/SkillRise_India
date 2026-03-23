// ═══════════════════════════════════════════════════════════════════════════════
// Hybrid Memory System — Example Usage
// ═══════════════════════════════════════════════════════════════════════════════
// Run: node agentic-chatbot/examples/memoryExample.js
// Requires: MONGODB_URI and GOOGLE_API_KEY in .env

require("dotenv").config();
const mongoose = require("mongoose");
const { getUserMemory, updateUserMemory, personalizeContext } = require("../agentic-chatbot/memory/memoryEngine");

async function main() {
  // Connect to MongoDB
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/sankalp";
  await mongoose.connect(uri);
  console.log("Connected to MongoDB.\n");

  const userId = "example-user-123";

  // ═══════════════════════════════════════════════════════════════════════════
  // Step 1: Get user memory (creates default if first time)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log("═══ Step 1: getUserMemory ═══");
  const memory = await getUserMemory(userId);
  console.log("Goals:", memory.goals);
  console.log("Interests:", memory.interests);
  console.log("Total Queries:", memory.interactionSignals?.totalQueries);
  console.log();

  // ═══════════════════════════════════════════════════════════════════════════
  // Step 2: Simulate a query → response cycle
  // ═══════════════════════════════════════════════════════════════════════════
  console.log("═══ Step 2: updateUserMemory (simulated query) ═══");
  const fakeQuery = "What are good machine learning courses for beginners?";
  const fakeResponse = {
    careerRecommendations: [
      { jobTitle: "ML Engineer", matchScore: 85 }
    ],
    courses: [
      { name: "Andrew Ng ML Course", link: "https://coursera.org/ml", provider: "Coursera" }
    ]
  };

  const updated = await updateUserMemory(userId, fakeQuery, fakeResponse);
  if (updated) {
    console.log("Updated Goals:", updated.goals);
    console.log("Updated Interests:", updated.interests);
    console.log("Past Recommendations:", updated.pastRecommendations.length);
  }
  console.log();

  // ═══════════════════════════════════════════════════════════════════════════
  // Step 3: Personalize a new query using memory
  // ═══════════════════════════════════════════════════════════════════════════
  console.log("═══ Step 3: personalizeContext ═══");
  const freshMemory = await getUserMemory(userId);
  const { enhancedQuery, userPreferences } = personalizeContext("What should I learn next?", freshMemory);
  console.log("Enhanced Query:", enhancedQuery);
  console.log("User Preferences:", JSON.stringify(userPreferences, null, 2));

  // Cleanup
  await mongoose.disconnect();
  console.log("\nDisconnected. Done.");
}

main().catch(err => {
  console.error("Example failed:", err);
  process.exit(1);
});
