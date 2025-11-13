import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  addModuleToCourse,
  getModulesByCourse,
  updateModule,
  deleteModule,
} from "../controllers/moduleController.js";

const router = express.Router();

/////////////////////////////////////////
// POST /api/courses/:courseId/modules
// Add a module to a specific course
/////////////////////////////////////////
router.post(
  "/:courseId/modules",
  protect,
  authorizeRoles("teacher", "admin"),
  addModuleToCourse
);

/////////////////////////////////////////
// GET /api/courses/:courseId/modules
// Get all modules of a course
/////////////////////////////////////////
router.get(
  "/:courseId/modules",
  protect,
  authorizeRoles("student", "teacher", "admin"),
  getModulesByCourse
);

/////////////////////////////////////////
// PUT /api/courses/:courseId/modules/:moduleId
// Update a module of a specific course
/////////////////////////////////////////
router.put(
  "/:courseId/modules/:moduleId",
  protect,
  authorizeRoles("teacher", "admin"),
  updateModule
);

/////////////////////////////////////////
// DELETE /api/courses/:courseId/modules/:moduleId
// Delete a module from a specific course
/////////////////////////////////////////
router.delete(
  "/:courseId/modules/:moduleId",
  protect,
  authorizeRoles("teacher", "admin"),
  deleteModule
);

export default router;
