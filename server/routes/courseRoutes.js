import express from "express";
import { createCourse, getCourses } from "../controllers/courseController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes below require authentication

// @route   GET /api/courses
// @desc    Get all courses
// @access  Private (any logged-in user)
router.get("/", protect, getCourses);

// @route   POST /api/courses
// @desc    Create a new course
// @access  Private (teacher/admin only)
router.post("/", protect, authorizeRoles("teacher", "admin"), createCourse);

export default router;
