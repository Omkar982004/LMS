import React, { createContext, useReducer, useContext } from "react";
import API from "../api";
import { studentReducer, studentInitialState } from "./studentReducer";
import { useAuth } from "./authContext";

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(studentReducer, studentInitialState);
  const { user } = useAuth();

  ////////////////////////////////
  // Fetch All Students (Admin/Teacher only)
  ////////////////////////////////
  const fetchStudents = async () => {
    dispatch({ type: "FETCH_STUDENTS_REQUEST" });
    try {
      const res = await API.get("/users?role=student");
      dispatch({ type: "FETCH_STUDENTS_SUCCESS", payload: res.data });
    } catch (err) {
      dispatch({
        type: "FETCH_STUDENTS_FAIL",
        payload: err.response?.data?.message || "Error fetching students",
      });
    }
  };

  ////////////////////////////////
  // Clear Error
  ////////////////////////////////
  const clearError = () => dispatch({ type: "CLEAR_STUDENT_ERROR" });

  return (
    <StudentContext.Provider
      value={{
        ...state,
        fetchStudents,
        clearError,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = () => useContext(StudentContext);
