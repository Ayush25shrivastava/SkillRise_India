// import express from "express";
// import multer from "multer";
// import { analyzeResume } from "../controllers/analyzerController.js";

// const router = express.Router();
// const upload = multer();

// router.post("/analyze", upload.single("resume"), analyzeResume);

// export default router;
//backend/src/routes/analyzerRoutes.js
import express from "express";
import multer from "multer";

import { analyzeResume } from "../controllers/analyzerController.js";

const router = express.Router();

const upload = multer({
 storage:multer.memoryStorage()
});

router.post("/analyze", upload.single("resume"), analyzeResume);

export default router;