import { Course, User } from '../models/models.js';

/////////////////////////
// Create a new course
/////////////////////////
export const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const teacherId = req.user.id; // from JWT middleware

    const newCourse = await Course.create({
      title,
      description,
      teacher: teacherId,
    });

    res.status(201).json({ message: 'Course created successfully', course: newCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating course' });
  }
};

/////////////////////////
// Get all courses
/////////////////////////
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('teacher', 'name email');
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
};

