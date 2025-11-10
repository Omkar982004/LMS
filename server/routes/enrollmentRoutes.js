import express from "express";
import {
  requestEnrollment,
  verifyEnrollment,
  addStudentToCourse,
  removeStudentFromCourse,
  getMyEnrollments,
  getAllEnrollmentRequests,
  getStudentEnrollments,
} from "../controllers/enrollmentController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

/////////////////////////
// Student: Request Enrollment
/////////////////////////
// POST /api/enrollments/:courseId/request
// Access: Private (students only)
router.post(
  "/:courseId/request",
  protect,
  authorizeRoles("student"),
  requestEnrollment
);

/////////////////////////
// Teacher/Admin: Approve or Reject Enrollment
/////////////////////////
// PUT /api/enrollments/:requestId/verify
// Access: Private (teacher/admin)
router.put(
  "/:requestId/verify",
  protect,
  authorizeRoles("teacher", "admin"),
  verifyEnrollment
);

/////////////////////////
// Admin: Manually Add a Student
/////////////////////////
// POST /api/enrollments/admin/add
// Access: Private (admin only)
router.post(
  "/admin/add",
  protect,
  authorizeRoles("admin"),
  addStudentToCourse
);

/////////////////////////
// Admin: Remove a Student from Course
/////////////////////////
// DELETE /api/enrollments/admin/remove
// Access: Private (admin only)
router.delete(
  "/admin/remove",
  protect,
  authorizeRoles("admin"),
  removeStudentFromCourse
);

/////////////////////////
// Student: Get Own Enrollments
/////////////////////////
// GET /api/enrollments/my
// Access: Private (student)
router.get(
  "/my",
  protect,
  authorizeRoles("student"),
  getMyEnrollments
);

/////////////////////////
// Admin/Teacher: Get All Enrollment Requests
/////////////////////////
// GET /api/enrollments/requests
// Access: Private (admin, teacher)
router.get(
  "/requests",
  protect,
  authorizeRoles("teacher", "admin"),
  getAllEnrollmentRequests
);

/////////////////////////
// Admin/Teacher: Get a Particular Student's Enrollments
/////////////////////////
// GET /api/enrollments/student/:studentId
// Access: Private (admin, teacher)
router.get(
  "/student/:studentId",
  protect,
  authorizeRoles("teacher", "admin"),
  getStudentEnrollments
);

export default router;
