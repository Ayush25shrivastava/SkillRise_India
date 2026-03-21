// src/routes/interview.routes.js
import { Router } from "express";
import {
  startInterview,
  submitAnswer,
  getReport,
} from "../controllers/interview.controller.js";

const router = Router();

router.post("/start", startInterview);
router.post("/answer", submitAnswer);
router.get("/report", getReport);

export default router;