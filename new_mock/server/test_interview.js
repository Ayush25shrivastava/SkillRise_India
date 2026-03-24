/**
 * 🛠️ Mock Interview Engine Runtime Test
 * This script runs the full lifecycle of the mock interview backend to detect any 500 crashes natively.
 */
import axios from "axios";

const API_BASE = "http://localhost:5050/api/interviews";

async function runTest() {
  let sessionId;
  let questions = [];

  console.log("🚀 STARTING MOCK INTERVIEW CYCLE (CARPENTER)...");

  try {
    // 1️⃣ CREATE INTERVIEW
    console.log("\n[1] Creating Interview...");
    const createRes = await axios.post(`${API_BASE}/create`, {
      role: "Carpenter",
      difficulty: "mid",
      type: "technical",
      techstack: ["Woodworking", "Safety", "Power tools"],
      language: "English"
    });
    
    sessionId = createRes.data.id;
    questions = createRes.data.questions;
    console.log("✅ Session Created! ID:", sessionId);
    console.log("❓ Initial Questions:");
    console.log(questions);

    // 2️⃣ DYNAMIC FOLLOW UP (MOCK ANSWER)
    console.log("\n[2] Testing Dynamic Follow-up generation...");
    const transcript = [
      { role: "assistant", content: questions[0] },
      { role: "user", content: "I have 5 years of experience building cabinets and installing drywall." }
    ];
    
    const nextQRes = await axios.post(`${API_BASE}/${sessionId}/next-question`, { transcript });
    console.log("✅ Next Question Generated:", nextQRes.data.nextQuestion);

    // 3️⃣ UPDATE TRANSCRIPT
    console.log("\n[3] Simulating Interview End (Saving Transcript)...");
    const finalTranscript = [
      ...transcript,
      { role: "assistant", content: nextQRes.data.nextQuestion },
      { role: "user", content: "I would ensure I wear safety goggles and measure twice." },
      { role: "assistant", content: "That's great. What about power tools?" },
      { role: "user", content: "I use Table saws." },
    ];
    
    await axios.put(`${API_BASE}/${sessionId}`, {
      transcript: finalTranscript,
      duration: 180,
      status: "completed"
    });
    console.log("✅ Transcript Saved in Database!");

    // 4️⃣ GENERATE FEEDBACK (THE 500 CRASH TEST!)
    console.log("\n[4] Generating Feedback Report (Grok AI)...");
    const feedbackRes = await axios.post(`${API_BASE}/${sessionId}/generate-feedback`, {});
    console.log("✅ Feedback Generated Successfully!");
    console.log("📝 finalAssessment:", feedbackRes.data.evaluation.finalAssessment);
    console.log("📊 categoryBreakdown:", feedbackRes.data.evaluation.categoryBreakdown);
    console.log("🌟 score:", feedbackRes.data.score);

  } catch (error) {
    console.error("\n❌❌❌ FATAL RUNTIME ERROR DETECTED ❌❌❌");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Payload Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Message:", error.message);
    }
  }
}

runTest();
