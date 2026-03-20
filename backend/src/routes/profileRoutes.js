import express from "express";
import { createProfile } from "../controllers/profileController.js";
//import authMiddleware from "../middleware/authMiddleware.js";
import { authenticate } from "../middleware/auth.js";
import User from "../models/user.js";
const router = express.Router();

router.post("/", authenticate, createProfile);
router.get("/me", authenticate, async (req, res) => {
  try {
    console.log("USER FROM TOKEN:", req.user);

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("ERROR IN /me:", err);
    res.status(500).json({ message: err.message });
  }
});
export default router;







