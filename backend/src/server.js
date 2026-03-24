// import "dotenv/config";
// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import profileRoutes from "./routes/profileRoutes.js";
// import roadmapRoutes from "./routes/roadmap.js";
// import authRoutes from "./routes/authRoutes.js";
// import blogRoutes from "./routes/blog.routes.js";
// import adminRoutes from "./routes/adminRoutes.js";
// import { Server } from "socket.io";
// //import adminRoutes from "./routes/adminRoutes.js";
// import { createServer } from "http";


// //import {io} from "./server.js";
// const httpServer = createServer(app);
// const app = express();

// const io = new Server(httpServer, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"]
//   }
// });

// // Middleware
// app.use(express.json());
// app.use(cors());

// app.use("/api/roadmap", roadmapRoutes);
// app.get("/", (req, res) => {
//   res.send("Roadmap API running...");
// });

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/profile", profileRoutes);
// app.use("/api/blogs", blogRoutes);
// app.use("/api/admin", adminRoutes);
// // Test route
// app.get("/", (req, res) => {
//   res.send("Auth API Running");
// });


// io.on("connection", (socket) => {
//   console.log("Admin connected:", socket.id);
  
//   socket.on("disconnect", () => {
//     console.log("Admin disconnected:", socket.id);
//   });
// });

// // Broadcast stats update when new user registers
// export const broadcastStatsUpdate = () => {
//   io.emit("stats-update");
// };

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB connected");

//     app.listen(process.env.PORT || 8000, () => {
//       console.log(`Server running on port ${process.env.PORT || 8000}`);
//     });

//   })
//   .catch((error) => {
//     console.error("MongoDB connection error:", error);
//   });


// export {io};
  
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import passport from "passport";
import "./config/Passport.js";
import profileRoutes from "./routes/profileRoutes.js";
import roadmapRoutes from "./routes/roadmap.js";
import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blog.routes.js";
import adminRoutes from "./routes/adminRoutes.js";
import programRoutes from "./routes/program.routes.js";
import opportunityRoutes from "./routes/opportunity.routes.js";

// ✅ STEP 1: create app FIRST
const app = express();

// ✅ STEP 2: create HTTP server
const httpServer = createServer(app);

// ✅ STEP 3: create socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// Routes
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/admin", adminRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API Running");
});

// Socket connection
io.on("connection", (socket) => {
  console.log("Admin connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Admin disconnected:", socket.id);
  });
});

// Broadcast function
export const broadcastStatsUpdate = () => {
  io.emit("stats-update");
};

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

    // ✅ IMPORTANT: use httpServer, NOT app.listen
    httpServer.listen(process.env.PORT || 8000, () => {
      console.log(`Server running on port ${process.env.PORT || 8000}`);
    });

  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

export { io };
