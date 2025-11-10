import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/authContext";
import { CourseProvider } from "./context/courseContext";
import { EnrollmentProvider } from "./context/enrollmentContext";
import { StudentProvider } from "./context/studentContext.jsx";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CourseProvider>
        <EnrollmentProvider>
          <StudentProvider >
            <App />
          </StudentProvider>
        </EnrollmentProvider>
      </CourseProvider>
    </AuthProvider>
  </StrictMode>
);
