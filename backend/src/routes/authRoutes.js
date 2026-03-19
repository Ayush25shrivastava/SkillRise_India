// routes/authRoutes.js
import express from "express";
import {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";
import passport from "passport";
import "../config/Passport.js";
import { authenticate } from "../middleware/auth.js";
import User from "../models/user.js";

const router = express.Router();


// Register user
router.post("/register", registerUser);


// Login user
router.post("/login", loginUser);

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = req.user.getSignedJwtToken();
    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
  }
);

export default router;