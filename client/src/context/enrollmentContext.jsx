import { createContext, useReducer, useContext , useEffect} from "react";
import API from "../api";
import { enrollmentReducer, enrollmentInitialState } from "./enrollmentReducer";
import { useAuth } from "./authContext";

const EnrollmentContext = createContext();

export const EnrollmentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(enrollmentReducer, enrollmentInitialState);
  const { user , isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.role === "student") {
      fetchMyEnrollments();
    }
  }, [isAuthenticated, user]);

  ////////////////////////////////
  // Student: Request Enrollment
  ////////////////////////////////
  const requestEnrollment = async (courseId) => {
  dispatch({ type: "ENROLLMENT_REQUEST_START" });
  try {
    const res = await API.post(`/enrollments/${courseId}/request`);

    //  Dispatch to update immediately
    dispatch({ type: "ENROLLMENT_REQUEST_SUCCESS", payload: res.data.request });

    //  Also refresh the student's enrollments (optional but keeps things synced)
    await fetchMyEnrollments();
  } catch (err) {
    dispatch({
      type: "ENROLLMENT_ERROR",
      payload: err.response?.data?.message || "Error requesting enrollment",
    });
  }
};


  ////////////////////////////////
  // Admin/Teacher: Verify Enrollment (approve/reject)
  ////////////////////////////////
  const verifyEnrollment = async (requestId, action) => {
    dispatch({ type: "ENROLLMENT_REQUEST_START" });
    try {
      const res = await API.put(`/enrollments/${requestId}/verify`, { action });
      dispatch({ type: "ENROLLMENT_VERIFY_SUCCESS", payload: res.data.request });
    } catch (err) {
      dispatch({
        type: "ENROLLMENT_ERROR",
        payload: err.response?.data?.message || "Error verifying request",
      });
    }
  };

  ////////////////////////////////
  // Admin: Add Student to Course Manually
  ////////////////////////////////
  const addStudentToCourse = async (studentId, courseId) => {
    dispatch({ type: "ENROLLMENT_REQUEST_START" });
    try {
      const res = await API.post(`/enrollments/admin/add`, { studentId, courseId });
      dispatch({ type: "ADD_ENROLLMENT_SUCCESS", payload: res.data });
    } catch (err) {
      dispatch({
        type: "ENROLLMENT_ERROR",
        payload: err.response?.data?.message || "Error adding enrollment",
      });
    }
  };

  ////////////////////////////////
  // Admin: Remove Student from Course
  ////////////////////////////////
  const removeStudentFromCourse = async (studentId, courseId) => {
    dispatch({ type: "ENROLLMENT_REQUEST_START" });
    try {
      await API.delete(`/enrollments/admin/remove`, {
        data: { studentId, courseId },
      });
      dispatch({ type: "REMOVE_ENROLLMENT_SUCCESS", payload: courseId });
    } catch (err) {
      dispatch({
        type: "ENROLLMENT_ERROR",
        payload: err.response?.data?.message || "Error removing enrollment",
      });
    }
  };

  ////////////////////////////////
  // Fetch Enrollment Data for Current User
  ////////////////////////////////
  const fetchMyEnrollments = async () => {
    dispatch({ type: "ENROLLMENT_REQUEST_START" });
    try {
      const res = await API.get("/enrollments/my");
      dispatch({
        type: "ENROLLMENT_FETCH_SUCCESS",
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: "ENROLLMENT_ERROR",
        payload: err.response?.data?.message || "Error fetching enrollments",
      });
    }
  };

  const fetchEnrollmentsByStudent = async (studentId) => {
  dispatch({ type: "ENROLLMENT_REQUEST_START" });
  try {
    const res = await API.get(`/enrollments/student/${studentId}`);
    dispatch({
      type: "ENROLLMENT_FETCH_SUCCESS",
      payload: {
        requests: res.data.pending || [],
        enrolledCourses: res.data.enrolled || [],
      },
    });
  } catch (err) {
    dispatch({
      type: "ENROLLMENT_ERROR",
      payload: err.response?.data?.message || "Error fetching student enrollments",
    });
  }
};


  ////////////////////////////////
  // Clear error message
  ////////////////////////////////
  const clearError = () => dispatch({ type: "ENROLLMENT_CLEAR_ERROR" });

  return (
    <EnrollmentContext.Provider
      value={{
        ...state,
        requestEnrollment,
        verifyEnrollment,
        addStudentToCourse,
        removeStudentFromCourse,
        fetchMyEnrollments,
        fetchEnrollmentsByStudent,
        clearError,
      }}
    >
      {children}
    </EnrollmentContext.Provider>
  );
};

export const useEnrollment = () => useContext(EnrollmentContext);
