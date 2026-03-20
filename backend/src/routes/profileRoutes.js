import express from "express";
import { createProfile } from "../controllers/profileController.js";
//import authMiddleware from "../middleware/authMiddleware.js";
import { authenticate } from "../middleware/auth.js";
const router = express.Router();

router.post("/", authenticate, createProfile);

export default router;