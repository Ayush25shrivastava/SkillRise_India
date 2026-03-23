import express from "express";
import {
  createBlog,
  getMyBlogs,
  updateBlog,
  deleteBlog
} from "../controllers/blog.controller.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // All blog routes are protected

router.post("/", authorize("ngo"), createBlog);
router.get("/my", authorize("ngo"), getMyBlogs);
router.put("/:id", authorize("ngo"), updateBlog);
router.delete("/:id", authorize("ngo"), deleteBlog);

export default router;
