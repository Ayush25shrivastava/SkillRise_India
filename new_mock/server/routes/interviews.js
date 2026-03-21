import express from "express";
import { 
  createInterviewSession, 
  submitInterviewSession, 
  getInterviews, 
  getInterview,
  getStats
} from "../controllers/interviewController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect); // Secure all production routes

// Refactored to match user specification
router.post("/create", createInterviewSession);
router.post("/submit", submitInterviewSession);
router.get("/", getInterviews);
router.get("/stats", getStats); // ⚡ FIXED: Added missing stats endpoint
router.get("/:id", getInterview);

export default router;
