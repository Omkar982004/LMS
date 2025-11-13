import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Courses from "./pages/Courses";
import CreatedCourses from "./pages/CreatedCourses";
import AddCourse from "./pages/AddCourse";
import { useAuth } from "./context/authContext";
import Navbar from "./components/navbar";
import Students from "./pages/Students";
import ManageEnrollments from "./pages/ManageEnrollments"; 
import MyEnrollments from "./pages/EnrolledCourses"; 
import ManageModules from "./pages/ManageModules";


function App() {
  const { isAuthenticated, user , authLoading} = useAuth();

  // Helper to protect routes
  const ProtectedRoute = ({ children, roles }) => {
    if (authLoading) return <p>Loading session...</p>; // wait until localStorage is checked

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />;

    return children;
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Homepage />
            </ProtectedRoute>
          }
        />

        {/* View all courses (any logged-in user) */}
        <Route
          path="/courses"
          element={
            <ProtectedRoute roles={["student", "teacher", "admin"]}>
              <Courses />
            </ProtectedRoute>
          }
        />

        {/* View courses created by logged-in teacher/admin */}
        <Route
          path="/created-courses"
          element={
            <ProtectedRoute roles={["teacher", "admin"]}>
              <CreatedCourses />
            </ProtectedRoute>
          }
        />

        {/* Create a new course (teacher/admin only) */}
        <Route
          path="/add-course"
          element={
            <ProtectedRoute roles={["teacher", "admin"]}>
              <AddCourse />
            </ProtectedRoute>
          }
        />

        {/* view all students */}
        <Route
          path="/students"
          element={
            <ProtectedRoute roles={["teacher", "admin"]}>
              <Students />
            </ProtectedRoute>
          }
        />

        {/* Manage a student's enrollments (admin/teacher) */}
        <Route
          path="/students/:id/manage-enrollments"
          element={
            <ProtectedRoute roles={["teacher", "admin"]}>
              <ManageEnrollments />
            </ProtectedRoute>
          }
        />

        {/* Student: My Enrollments Page */}
        <Route
          path="/my-enrollments"
          element={
            <ProtectedRoute roles={["student"]}>
              <MyEnrollments />
            </ProtectedRoute>
          }
        />

        {/* Teachers, admins: Manage Modules Page */}
        <Route
          path="/created-courses/:courseId/manage-modules"
          element={
            <ProtectedRoute roles={["teacher","admin"]}>
              <ManageModules />
            </ProtectedRoute>
          }
        />
      

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
