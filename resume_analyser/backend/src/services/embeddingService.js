// import { GoogleGenerativeAI } from "@google/generative-ai";
// import cosineSimilarity from "cosine-similarity";
// import dotenv from "dotenv";

// dotenv.config();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export async function getEmbedding(text) {

//  const model = genAI.getGenerativeModel({
//   model: "embedding-001"
//  });

//  const result = await model.embedContent(text);

//  return result.embedding.values;
// }

// export function compareEmbeddings(vec1, vec2) {
//  return cosineSimilarity(vec1, vec2);
// }

import cosineSimilarity from "cosine-similarity";

function textToVector(text) {
  const words = text.toLowerCase().split(/\W+/);
  const vector = {};

  words.forEach(w => {
    vector[w] = (vector[w] || 0) + 1;
  });

  return vector;
}

export async function getEmbedding(text) {
  return textToVector(text);
}

export function compareEmbeddings(vec1, vec2) {
  return cosineSimilarity(vec1, vec2);
}