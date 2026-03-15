// src/services/interview.service.js
import {
  startInterview as graphStart,
  submitAnswer as graphSubmit,
  getReport as graphReport,
} from "../graphs/interview.graph.js";

const VALID_LEVELS = ["Beginner", "Intermediate", "Advanced"];

export async function startInterviewSession({ role, level, skills, maxQuestions }) {
  if (!role || typeof role !== "string" || role.trim().length < 2) {
    throw Object.assign(new Error("'role' must be a non-empty string"), { status: 400 });
  }

  if (!VALID_LEVELS.includes(level)) {
    throw Object.assign(
      new Error(`'level' must be one of: ${VALID_LEVELS.join(", ")}`),
      { status: 400 }
    );
  }

  if (!Array.isArray(skills) || skills.length === 0) {
    throw Object.assign(new Error("'skills' must be a non-empty array"), { status: 400 });
  }

  const mCount = parseInt(maxQuestions) || 5;

  return graphStart({ role: role.trim(), level, skills, maxQuestions: mCount });
}

export async function submitAnswerToSession({ sessionId, answer }) {
  if (!sessionId) {
    throw Object.assign(new Error("'sessionId' is required"), { status: 400 });
  }
  if (!answer || typeof answer !== "string" || answer.trim().length < 1) {
    throw Object.assign(new Error("'answer' must be a non-empty string"), { status: 400 });
  }

  return graphSubmit({ sessionId, answer: answer.trim() });
}

export async function fetchReport({ sessionId }) {
  if (!sessionId) {
    throw Object.assign(new Error("'sessionId' is required as a query parameter"), { status: 400 });
  }

  return graphReport({ sessionId });
}