import express from "express";
import cors from "cors";

import interviewRoutes from "./routes/interview.routes.js";



const app = express();

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use("/api/interview", interviewRoutes);


export default app;