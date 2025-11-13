import { Assignment, Module, User } from "../models/models.js";

/////////////////////////////////////////
// POST /api/modules/:moduleId/assignments
// Desc: Add a new assignment to a module
// Access: Private (teacher/admin)
/////////////////////////////////////////
export const addAssignment = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { title, description, dueDate } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if module exists
    const module = await Module.findById(moduleId).populate("course");
    if (!module) return res.status(404).json({ message: "Module not found" });

    // Only the teacher of the course or admin can add assignments
    if (userRole === "teacher" && module.course.teacher.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to add assignments to this module" });
    }

    // Create assignment
    const newAssignment = await Assignment.create({
      title,
      description,
      dueDate,
      module: moduleId,
    });

    // Link it to the module
    module.assignments.push(newAssignment._id);
    await module.save();

    res.status(201).json({
      message: "Assignment added successfully",
      assignment: newAssignment,
    });
  } catch (error) {
    console.error("Error adding assignment:", error);
    res.status(500).json({ message: "Error adding assignment" });
  }
};

/////////////////////////////////////////
// GET /api/modules/:moduleId/assignments
// Desc: Get all assignments for a module
// Access: Private (teacher/admin/student enrolled)
/////////////////////////////////////////
export const getAssignmentsByModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Find the module
    const module = await Module.findById(moduleId).populate("course");
    if (!module) return res.status(404).json({ message: "Module not found" });

    // If student, check enrollment
    if (userRole === "student") {
      const student = await User.findById(userId);
      const isEnrolled = student.enrolledCourses.some(
        (courseId) => courseId.toString() === module.course._id.toString()
      );
      if (!isEnrolled) {
        return res.status(403).json({
          message: "You are not enrolled in this course",
        });
      }
    }

    // Fetch assignments
    const assignments = await Assignment.find({ module: moduleId }).select(
      "title description dueDate createdAt"
    );

    res.status(200).json({
      module: { id: module._id, title: module.title },
      totalAssignments: assignments.length,
      assignments,
    });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ message: "Error fetching assignments" });
  }
};

/////////////////////////////////////////
// PUT /api/modules/:moduleId/assignments/:assignmentId
// Desc: Update an assignment
// Access: Private (teacher/admin)
/////////////////////////////////////////
export const updateAssignment = async (req, res) => {
  try {
    const { moduleId, assignmentId } = req.params;
    const { title, description, dueDate } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const assignment = await Assignment.findById(assignmentId).populate({
      path: "module",
      populate: { path: "course" },
    });
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    // Only teacher or admin can update
    if (userRole === "teacher" && assignment.module.course.teacher.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this assignment" });
    }

    assignment.title = title || assignment.title;
    assignment.description = description || assignment.description;
    assignment.dueDate = dueDate || assignment.dueDate;

    await assignment.save();

    res
      .status(200)
      .json({ message: "Assignment updated successfully", assignment });
  } catch (error) {
    console.error("Error updating assignment:", error);
    res.status(500).json({ message: "Error updating assignment" });
  }
};

/////////////////////////////////////////
// DELETE /api/modules/:moduleId/assignments/:assignmentId
// Desc: Delete an assignment
// Access: Private (teacher/admin)
/////////////////////////////////////////
export const deleteAssignment = async (req, res) => {
  try {
    const { moduleId, assignmentId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const assignment = await Assignment.findById(assignmentId).populate({
      path: "module",
      populate: { path: "course" },
    });
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    // Only teacher or admin can delete
    if (userRole === "teacher" && assignment.module.course.teacher.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this assignment" });
    }

    // Remove from module
    await Module.findByIdAndUpdate(moduleId, {
      $pull: { assignments: assignmentId },
    });

    await assignment.deleteOne();

    res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    res.status(500).json({ message: "Error deleting assignment" });
  }
};

/////////////////////////////////////////
// POST /api/modules/:moduleId/assignments/:assignmentId/submit
// Desc: Student submits an assignment
// Access: Private (student)
/////////////////////////////////////////
export const submitAssignment = async (req, res) => {
  try {
    const { moduleId, assignmentId } = req.params;
    const { fileUrl } = req.body;
    const studentId = req.user.id;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    // Check if already submitted
    const existingSubmission = assignment.submissions.find(
      (sub) => sub.student.toString() === studentId
    );
    if (existingSubmission)
      return res
        .status(400)
        .json({ message: "You have already submitted this assignment" });

    // Add submission
    assignment.submissions.push({
      student: studentId,
      fileUrl,
      submittedAt: new Date(),
    });

    await assignment.save();

    res.status(200).json({ message: "Assignment submitted successfully" });
  } catch (error) {
    console.error("Error submitting assignment:", error);
    res.status(500).json({ message: "Error submitting assignment" });
  }
};

/////////////////////////////////////////
// PUT /api/modules/:moduleId/assignments/:assignmentId/grade
// Desc: Grade a student's submission
// Access: Private (teacher/admin)
/////////////////////////////////////////
export const gradeAssignment = async (req, res) => {
  try {
    const { moduleId, assignmentId } = req.params;
    const { studentId, marks } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const assignment = await Assignment.findById(assignmentId).populate({
      path: "module",
      populate: { path: "course" },
    });
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    // Only teacher/admin can grade
    if (userRole === "teacher" && assignment.module.course.teacher.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to grade this assignment" });
    }

    const submission = assignment.submissions.find(
      (sub) => sub.student.toString() === studentId
    );
    if (!submission)
      return res.status(404).json({ message: "Submission not found" });

    submission.marks = marks;
    await assignment.save();

    res.status(200).json({ message: "Marks updated successfully", submission });
  } catch (error) {
    console.error("Error grading assignment:", error);
    res.status(500).json({ message: "Error grading assignment" });
  }
};
