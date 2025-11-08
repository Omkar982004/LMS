import mongoose from 'mongoose';

/////////////////////////
// User Schema
/////////////////////////
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
}, { timestamps: true });

/////////////////////////
// Course Schema
/////////////////////////
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }]
}, { timestamps: true });

/////////////////////////
// Module Schema
/////////////////////////
const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }]
}, { timestamps: true });

/////////////////////////
// Assignment Schema
/////////////////////////
const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  dueDate: Date,
  submissions: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fileUrl: String,
    marks: Number,
    submittedAt: Date
  }]
}, { timestamps: true });

/////////////////////////
// Progress Schema
/////////////////////////
const progressSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  completed: { type: Boolean, default: false },
  lastAccessed: Date
}, { timestamps: true });

/////////////////////////
// FinalGrades Schema
/////////////////////////
const finalGradeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  totalScore: Number,
  letterGrade: String,
  moduleGrades: [{
    module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
    score: Number
  }]
}, { timestamps: true });

/////////////////////////
// Export Models
/////////////////////////
const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);
const Module = mongoose.model('Module', moduleSchema);
const Assignment = mongoose.model('Assignment', assignmentSchema);
const Progress = mongoose.model('Progress', progressSchema);
const FinalGrade = mongoose.model('FinalGrade', finalGradeSchema);

export {
  User,
  Course,
  Module,
  Assignment,
  Progress,
  FinalGrade
};
