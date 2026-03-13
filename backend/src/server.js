import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();


// Middleware
app.use(express.json());
app.use(cors());


// Routes
app.use("/api/auth", authRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("Auth API Running");
});


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });

  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });