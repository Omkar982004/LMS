import { Course, User, EnrollmentRequest } from "../models/models.js";

// POST /api/courses/:courseId/request
export const requestEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Check if already enrolled
    const student = await User.findById(studentId);
    if (student.enrolledCourses.includes(courseId)) {
      return res
        .status(400)
        .json({ message: "Already enrolled in this course" });
    }

    // Check if a pending request already exists
    const existingRequest = await EnrollmentRequest.findOne({
      student: studentId,
      course: courseId,
      status: "pending",
    });
    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Enrollment request already pending" });
    }

    // Create new request
    const newRequest = await EnrollmentRequest.create({
      student: studentId,
      course: courseId,
      status: "pending",
    });

    // Populate the course field so frontend can show it immediately
    const populatedRequest = await newRequest.populate(
      "course",
      "title description teacher"
    );

    res.status(201).json({
      message: "Enrollment request submitted",
      request: populatedRequest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating enrollment request" });
  }
};

// PUT /api/enrollments/:requestId/verify
export const verifyEnrollment = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action } = req.body; // "approve" or "reject"

    const request = await EnrollmentRequest.findById(requestId)
      .populate("student")
      .populate("course");

    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "pending")
      return res.status(400).json({ message: "Request already reviewed" });

    if (action === "approve") {
      const student = await User.findById(request.student._id);
      student.enrolledCourses.push(request.course._id);
      await student.save();

      request.status = "approved";
    } else if (action === "reject") {
      request.status = "rejected";
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    request.reviewedAt = new Date();
    await request.save();

    res.status(200).json({ message: `Request ${request.status}`, request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error verifying enrollment request" });
  }
};

// POST /api/enrollments/admin/add
export const addStudentToCourse = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    const student = await User.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student || !course)
      return res.status(404).json({ message: "Student or course not found" });

    // Check if already enrolled
    if (student.enrolledCourses.includes(courseId)) {
      return res
        .status(400)
        .json({ message: "Student already enrolled in this course" });
    }

    student.enrolledCourses.push(courseId);
    await student.save();

    res.status(200).json({
      message: "Student added to course successfully",
      student: {
        id: student._id,
        name: student.name,
        enrolledCourses: student.enrolledCourses,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding student to course" });
  }
};

// DELETE /api/enrollments/admin/remove
export const removeStudentFromCourse = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    const student = await User.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student || !course)
      return res.status(404).json({ message: "Student or course not found" });

    // Check enrollment
    if (!student.enrolledCourses.includes(courseId)) {
      return res
        .status(400)
        .json({ message: "Student is not enrolled in this course" });
    }

    student.enrolledCourses = student.enrolledCourses.filter(
      (id) => id.toString() !== courseId
    );
    await student.save();

    res.status(200).json({
      message: "Student removed from course successfully",
      student: {
        id: student._id,
        name: student.name,
        enrolledCourses: student.enrolledCourses,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing student from course" });
  }
};

/////////////////////////////////////////
// GET /api/enrollments/my
// Desc: Get all enrollments (requests + approved) for the logged-in student
// Access: Private (student)
/////////////////////////////////////////
export const getMyEnrollments = async (req, res) => {
  try {
    const studentId = req.user.id;

    //  Fetch enrollment requests (with teacher details)
    const requests = await EnrollmentRequest.find({ student: studentId })
      .populate({
        path: "course",
        select: "title description teacher",
        populate: {
          path: "teacher",
          select: "name email", // <-- populate teacher details
        },
      })
      .sort({ createdAt: -1 });

    //  Fetch enrolled courses (with teacher details)
    const student = await User.findById(studentId).populate({
      path: "enrolledCourses",
      select: "title description teacher",
      populate: {
        path: "teacher",
        select: "name email", // <-- populate teacher details
      },
    });

    res.status(200).json({
      requests,
      enrolledCourses: student?.enrolledCourses || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching enrollments" });
  }
};


/////////////////////////////////////////
// GET /api/enrollments/requests
// Desc: Get all pending/approved/rejected requests (for teacher/admin)
// Access: Private (teacher/admin)
/////////////////////////////////////////
export const getAllEnrollmentRequests = async (req, res) => {
  try {
    // Teachers see only their course requests
    let filter = {};
    if (req.user.role === "teacher") {
      filter = { "course.teacher": req.user.id };
    }

    const requests = await EnrollmentRequest.find(filter)
      .populate("student", "name email")
      .populate("course", "title teacher")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching enrollment requests" });
  }
};

/////////////////////////////////////////
// GET /api/enrollments/student/:studentId
// Desc: Get a specific student’s enrollment status (pending + enrolled courses)
// Access: Private (admin/teacher)
/////////////////////////////////////////
export const getStudentEnrollments = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find student and populate enrolledCourses → course → teacher
    const student = await User.findById(studentId)
      .populate({
        path: "enrolledCourses",
        select: "title description teacher",
        populate: {
          path: "teacher",
          select: "name email",
        },
      });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find all enrollment requests for this student
    const requests = await EnrollmentRequest.find({ student: studentId })
      .populate({
        path: "course",
        select: "title description teacher",
        populate: {
          path: "teacher",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    //  Send structured response
    res.status(200).json({
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
      },
      pending: requests.filter((r) => r.status === "pending"),
      enrolled: student.enrolledCourses || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching student enrollments" });
  }
};

