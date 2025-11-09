import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Courses from "./pages/Courses";
import CreatedCourses from "./pages/CreatedCourses";
import AddCourse from "./pages/AddCourse";
import { useAuth } from "./context/authContext";
import Navbar from "./components/navbar";

function App() {
  const { isAuthenticated, user } = useAuth();

  // Helper to protect routes
  const ProtectedRoute = ({ children, roles }) => {
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

        Create a new course (teacher/admin only)
        <Route
          path="/add-course"
          element={
            <ProtectedRoute roles={["teacher", "admin"]}>
              <AddCourse />
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
