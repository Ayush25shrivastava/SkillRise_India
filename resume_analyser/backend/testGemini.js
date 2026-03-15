import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function safeGenerate(prompt, retryCount = 0) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (err) {
        // Check if it's a Quota Error (429)
        if (err.message.includes("429") && retryCount < 3) {
            console.warn(`⚠️ Quota hit. Retrying in 40 seconds... (Attempt ${retryCount + 1})`);
            await new Promise(res => setTimeout(res, 40000)); // Wait 40s
            return safeGenerate(prompt, retryCount + 1);
        }
        throw err;
    }
}

async function run() {
    console.log("🚀 Starting Smart Request...");
    try {
        const text = await safeGenerate("Say 'System is online'");
        console.log("✅ RESULT:", text);
    } catch (err) {
        console.error("❌ FATAL ERROR:", err.message);
        console.log("PRO TIP: Go to https://aistudio.google.com/app/plan_and_billing to see if your Daily Limit is 0.");
    }
}

run();