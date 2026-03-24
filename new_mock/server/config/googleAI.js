import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiKeys = [
  process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  process.env.GOOGLE_API_KEY_1,
  process.env.GOOGLE_API_KEY_2,
  process.env.GOOGLE_API_KEY_3
].filter(Boolean);

if (geminiKeys.length === 0) {
  console.warn("⚠️ No GOOGLE_GENERATIVE_AI_API_KEY or GOOGLE_API_KEY_1/2/3 is configured.");
}

let currentKeyIndex = 0;

export const getGeminiModel = () => {
  const apiKey = geminiKeys.length > 0 ? geminiKeys[currentKeyIndex] : "dummy_key";
  if (geminiKeys.length > 0) {
    currentKeyIndex = (currentKeyIndex + 1) % geminiKeys.length;
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json"
    }
  });
};
