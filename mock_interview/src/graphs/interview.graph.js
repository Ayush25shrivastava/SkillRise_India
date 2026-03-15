// src/graphs/interview.graph.js
import { StateGraph, START, END } from "@langchain/langgraph";
import { v4 as uuidv4 } from "uuid";
import { getNextQuestion, getFollowUpQuestion } from "../services/question.service.js";
import { processAnswer } from "../services/evaluation.service.js";
import { generateFinalReport } from "../services/llm.service.js";
import { InterviewSession } from "../models/interviewSession.model.js";

// ── In-memory store ──
const sessions = new Map();

export function getSession(id) {
  return sessions.get(id) ?? null;
}

/**
 * Node: Generate Question
 */
async function nodeGenerateQuestion(state) {
  console.log("Entering nodeGenerateQuestion", state);
  const previousQuestions = state.history.map((h) => h.question);
  
  // Skill Rotation
  const availableSkills = state.skills.filter(s => !state.testedSkills.includes(s));
  const targetSkill = availableSkills.length > 0 ? availableSkills[0] : state.skills[Math.floor(Math.random() * state.skills.length)];

  // Category Rotation
  const categories = ["Concept", "Implementation", "Debugging", "Optimization"];
  const currentCategory = categories[state.categoryIndex % categories.length];

  const question = await getNextQuestion({
    role: state.role,
    level: state.level,
    skills: [targetSkill],
    category: currentCategory,
    difficulty: state.difficulty || "medium",
    questionNumber: state.questionNumber,
    previousQuestions,
  });

  const newState = {
    ...state,
    currentQuestion: question,
    currentSkill: targetSkill,
    categoryIndex: state.categoryIndex + 1,
    followUpUsed: false, // Reset follow-up flag for new topic
    state: "questioning",
  };
  console.log("Exiting nodeGenerateQuestion", newState);
  return newState;
}

/**
 * Node: Evaluate Answer & Decide Next Step
 */
async function nodeEvaluateAnswer(state) {
  if (!state.pendingAnswer) return state;

  const evaluation = await processAnswer({
    role: state.role,
    level: state.level,
    question: state.currentQuestion,
    answer: state.pendingAnswer,
  });

  const newEntry = {
    skill: state.currentSkill,
    question: state.currentQuestion,
    answer: state.pendingAnswer,
    evaluation,
  };

  const updatedHistory = [...state.history, newEntry];
  const isDone = updatedHistory.length >= (state.maxQuestions || 5);

  let nextQuestion = null;
  let nextState = isDone ? "reporting" : "questioning";
  let followUpUsedForThisTurn = state.followUpUsed || false;

  // Adaptive Difficulty Logic
  const score = evaluation.score?.overall || 0;
  let nextDifficulty = "medium";
  if (score >= 8) nextDifficulty = "hard";
  else if (score < 5) nextDifficulty = "easy";
  
  // Follow-up Logic: Trigger only if NO follow-up was asked for this topic yet
  const shouldFollowUp = (score < 6 || evaluation.isFollowUpNeeded) && !isDone && !followUpUsedForThisTurn;
  
  let updatedTestedSkills = [...state.testedSkills];
  
  if (shouldFollowUp) {
    nextQuestion = await getFollowUpQuestion({
        role: state.role,
        level: state.level,
        question: state.currentQuestion,
        answer: state.pendingAnswer,
        feedback: evaluation.feedback
    });
    followUpUsedForThisTurn = true; // Mark follow-up as used
  } else {
    // If no follow-up requested OR follow-up already used, close the topic
    if (state.currentSkill && !updatedTestedSkills.includes(state.currentSkill)) {
      updatedTestedSkills.push(state.currentSkill);
    }
    followUpUsedForThisTurn = false; // Topic closed
  }

  return {
    ...state,
    history: updatedHistory,
    questionNumber: state.questionNumber + 1,
    pendingAnswer: null,
    currentQuestion: nextQuestion,
    difficulty: nextDifficulty,
    testedSkills: updatedTestedSkills,
    followUpUsed: followUpUsedForThisTurn,
    state: nextState,
  };
}

/**
 * Node: Generate Final Report
 */
async function nodeGenerateReport(state) {
  const report = await generateFinalReport({
    role: state.role,
    level: state.level,
    history: state.history,
  });

  return {
    ...state,
    report,
    state: "done",
  };
}

// ── Build LangGraph ──
function buildInterruptibleGraph() {
  const graph = new StateGraph({
    channels: {
      id: null,
      role: null,
      level: null,
      skills: null,
      testedSkills: null,
      currentSkill: null,
      categoryIndex: null,
      maxQuestions: null,
      followUpUsed: null,
      difficulty: null,
      state: null,
      currentQuestion: null,
      questionNumber: null,
      history: null,
      pendingAnswer: null,
      report: null
    }
  });

  graph.addNode("generate_question", nodeGenerateQuestion);
  graph.addNode("evaluate_answer", nodeEvaluateAnswer);
  graph.addNode("generate_report", nodeGenerateReport);

  graph.addConditionalEdges(START, (state) => {
    if (state.pendingAnswer) return "evaluate_answer";
    return "generate_question";
  });

  graph.addConditionalEdges("evaluate_answer", (state) => {
    if (state.state === "reporting") return "generate_report";
    if (state.currentQuestion) return END; // Follow-up already generated in evaluate_answer node
    return "generate_question";
  });

  graph.addEdge("generate_question", END);
  graph.addEdge("generate_report", END);

  return graph.compile();
}

const interviewGraph = buildInterruptibleGraph();

// ── Public API ──

export async function startInterview({ role, level, skills, maxQuestions }) {
  const sessionId = uuidv4();
  const initialState = {
    id: sessionId,
    role,
    level,
    skills,
    maxQuestions: maxQuestions || 5,
    testedSkills: [],
    currentSkill: null,
    categoryIndex: 0,
    followUpUsed: false,
    difficulty: "medium", // Default starting difficulty
    state: "init",
    currentQuestion: null,
    questionNumber: 1,
    history: [],
    pendingAnswer: null,
    report: null,
  };

  const result = await interviewGraph.invoke(initialState);
  sessions.set(result.id, result);

  return {
    sessionId: result.id,
    question: result.currentQuestion,
    questionNumber: result.questionNumber,
    skill: result.currentSkill,
    maxQuestions: result.maxQuestions
  };
}

export async function submitAnswer({ sessionId, answer }) {
  const session = sessions.get(sessionId);
  if (!session) throw new Error("Session not found");
  if (session.state === "done") throw new Error("Interview already completed");

  const inputState = {
    ...session,
    pendingAnswer: answer,
  };

  const result = await interviewGraph.invoke(inputState);
  sessions.set(sessionId, result);

  const lastEvaluation = result.history.at(-1).evaluation;

  if (result.state === "done") {
    return {
      score: lastEvaluation.score,
      feedback: lastEvaluation.feedback,
      betterAnswer: lastEvaluation.improvedAnswer,
      conversationalResponse: lastEvaluation.conversationalResponse,
      nextQuestion: null,
      isComplete: true
    };
  }

  return {
    score: lastEvaluation.score,
    feedback: lastEvaluation.feedback,
    betterAnswer: lastEvaluation.improvedAnswer,
    conversationalResponse: lastEvaluation.conversationalResponse,
    nextQuestion: result.currentQuestion,
    questionNumber: result.questionNumber,
    skill: result.currentSkill,
    isComplete: false,
  };
}

export async function getReport({ sessionId }) {
  const session = sessions.get(sessionId);
  if (!session) throw new Error("Session not found");

  if (session.state === "done") {
    return session.report;
  }

  const result = await nodeGenerateReport(session);
  sessions.set(sessionId, result);
  return result.report;
}