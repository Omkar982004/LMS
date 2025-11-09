import { createContext, useContext, useReducer } from "react";
import { courseReducer, initialCourseState } from "./courseReducer";
import API from "../api"; // your axios instance

const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(courseReducer, initialCourseState);

  // Fetch all courses
  const fetchCourses = async () => {
    dispatch({ type: "FETCH_COURSES_START" });
    try {
      const res = await API.get("/courses");
      dispatch({ type: "FETCH_COURSES_SUCCESS", payload: res.data });
    } catch (err) {
      dispatch({
        type: "FETCH_COURSES_ERROR",
        payload: err.response?.data?.message || "Error fetching courses",
      });
    }
  };

  // Create a new course
  const createCourse = async (title, description) => {
    try {
      const res = await API.post("/courses", { title, description });
      dispatch({ type: "ADD_COURSE", payload: res.data.course });
    } catch (err) {
      alert(err.response?.data?.message || "Error creating course");
    }
  };

  return (
    <CourseContext.Provider
      value={{
        ...state,
        fetchCourses,
        createCourse,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => useContext(CourseContext);
