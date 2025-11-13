import { Course, Module } from "../models/models.js";

/////////////////////////////////////////
// POST /api/courses/:courseId/modules
// Desc: Add a new module to a course
// Access: Private (teacher or admin)
/////////////////////////////////////////
export const addModuleToCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    //  Find the course
    const course = await Course.findById(courseId).populate("teacher", "name email");
    if (!course) return res.status(404).json({ message: "Course not found" });

    //  Only the teacher of the course or an admin can add modules
    if (userRole === "teacher" && course.teacher._id.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to add modules to this course" });
    }

    //  Create a new module
    const newModule = await Module.create({
      title,
      content,
      course: courseId,
    });

    //  Push it to course.modules
    course.modules.push(newModule._id);
    await course.save();

    res.status(201).json({
      message: "Module added successfully",
      module: newModule,
    });
  } catch (error) {
    console.error("Error adding module:", error);
    res.status(500).json({ message: "Error adding module to course" });
  }
};


/////////////////////////////////////////
// GET /api/courses/:courseId/modules
// Desc: Get all modules of a course
// Access: Private (teacher, admin, or enrolled student)
/////////////////////////////////////////
export const getModulesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if course exists
    const course = await Course.findById(courseId).populate("teacher", "name email");
    if (!course) return res.status(404).json({ message: "Course not found" });

    //  If student, verify enrollment
    if (userRole === "student") {
      const student = await User.findById(userId);
      const isEnrolled = student.enrolledCourses.some(
        (c) => c.toString() === courseId
      );
      if (!isEnrolled)
        return res.status(403).json({ message: "You are not enrolled in this course" });
    }

    //  Fetch modules
    const modules = await Module.find({ course: courseId })
      .populate("assignments", "title dueDate");

    res.status(200).json({
      course: {
        id: course._id,
        title: course.title,
        teacher: course.teacher,
      },
      totalModules: modules.length,
      modules,
    });
  } catch (error) {
    console.error("Error fetching modules:", error);
    res.status(500).json({ message: "Error fetching modules" });
  }
};


/////////////////////////////////////////
// PUT /api/modules/:moduleId
// Desc: Update a module (title/content)
// Access: Private (teacher/admin)
/////////////////////////////////////////
export const updateModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const module = await Module.findById(moduleId).populate("course");
    if (!module) return res.status(404).json({ message: "Module not found" });

    // Only the teacher of that course or admin can update
    const course = await Course.findById(module.course._id);
    if (userRole === "teacher" && course.teacher.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to update this module" });
    }

    module.title = title || module.title;
    module.content = content || module.content;
    await module.save();

    res.status(200).json({ message: "Module updated successfully", module });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating module" });
  }
};


/////////////////////////////////////////
// DELETE /api/modules/:moduleId
// Desc: Delete a module from a course
// Access: Private (teacher/admin)
/////////////////////////////////////////
export const deleteModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const module = await Module.findById(moduleId).populate("course");
    if (!module) return res.status(404).json({ message: "Module not found" });

    const course = await Course.findById(module.course._id);
    if (userRole === "teacher" && course.teacher.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this module" });
    }

    // Remove module reference from course.modules
    await Course.findByIdAndUpdate(course._id, { $pull: { modules: moduleId } });
    await module.deleteOne();

    res.status(200).json({ message: "Module deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting module" });
  }
};
