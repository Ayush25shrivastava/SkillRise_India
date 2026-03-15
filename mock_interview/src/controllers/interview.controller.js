// src/controllers/interview.controller.js
import {
  startInterviewSession,
  submitAnswerToSession,
  fetchReport,
} from "../services/interview.service.js";

// POST /api/interview/start
export async function startInterview(req, res) {
  try {
    const { role, level, skills, maxQuestions } = req.body;
    
    const result = await startInterviewSession({ role, level, skills, maxQuestions });

    res.status(201).json(result);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ success: false, error: err.message });
  }
}

// POST /api/interview/answer
export async function submitAnswer(req, res) {
  try {
    const { sessionId, answer } = req.body;
    
    const result = await submitAnswerToSession({ sessionId, answer });

    res.status(200).json(result);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ success: false, error: err.message });
  }
}

// GET /api/interview/report?sessionId=xxx
export async function getReport(req, res) {
  try {
    const { sessionId } = req.query;
    const report = await fetchReport({ sessionId });

    res.status(200).json(report);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ success: false, error: err.message });
  }
}