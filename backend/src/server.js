import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import profileRoutes from "./routes/profileRoutes.js";

import authRoutes from "./routes/authRoutes.js";

const app = express();


// Middleware
app.use(express.json());
app.use(cors());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Auth API Running");
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

  