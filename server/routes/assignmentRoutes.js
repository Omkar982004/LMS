import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  addAssignment,
  getAssignmentsByModule,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  gradeAssignment,
} from "../controllers/assignmentController.js";

const router = express.Router();

// Create assignment
router.post(
  "/",
  protect,
  authorizeRoles("teacher", "admin"),
  addAssignment
);

// Get all assignments of a module
router.get(
  "/",
  protect,
  authorizeRoles("student", "teacher", "admin"),
  getAssignmentsByModule
);

// Update assignment
router.put(
  "/:assignmentId",
  protect,
  authorizeRoles("teacher", "admin"),
  updateAssignment
);

// Delete assignment
router.delete(
  "/:assignmentId",
  protect,
  authorizeRoles("teacher", "admin"),
  deleteAssignment
);

// Student submit assignment
router.post(
  "/:assignmentId/submit",
  protect,
  authorizeRoles("student"),
  submitAssignment
);

// Teacher/Admin grade assignment
router.put(
  "/:assignmentId/grade",
  protect,
  authorizeRoles("teacher", "admin"),
  gradeAssignment
);

export default router;
