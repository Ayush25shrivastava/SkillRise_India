import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import passport from "passport";
import "./config/Passport.js";
import profileRoutes from "./routes/profileRoutes.js";
import roadmapRoutes from "./routes/roadmap.js";
import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blog.routes.js";
import programRoutes from "./routes/program.routes.js";
import opportunityRoutes from "./routes/opportunity.routes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// Routes
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/programs", programRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/opportunity", opportunityRoutes); // Alias for POST convenience requested

// Test route
app.get("/", (req, res) => {
  res.send("SkillRise API Running");
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server running on port ${process.env.PORT || 8000}`);
    });

  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });