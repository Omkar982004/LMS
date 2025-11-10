// src/context/enrollmentReducer.js

export const enrollmentInitialState = {
  requests: [], // pending/approved/rejected enrollment requests
  enrolledCourses: [], // list of enrolled courses
  loading: false, // loading state for API calls
  error: null, // any error message
};

export const enrollmentReducer = (state, action) => {
  switch (action.type) {
    case "ENROLLMENT_REQUEST_START":
      return { ...state, loading: true, error: null };

    case "ENROLLMENT_REQUEST_SUCCESS":
      // // avoid duplicates if somehow refetched quickly
      // if (state.requests.some((req) => req._id === action.payload._id)) {
      //   return { ...state, loading: false };
      // }
      return {
        ...state,
        loading: false,
        requests: [...state.requests, action.payload],
      };

    case "ENROLLMENT_FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        requests: action.payload.requests || [],
        enrolledCourses: action.payload.enrolledCourses || [],
      };

    case "ENROLLMENT_VERIFY_SUCCESS":
      return {
        ...state,
        loading: false,
        requests: state.requests.map((req) =>
          req._id === action.payload._id ? action.payload : req
        ),
      };

    case "ADD_ENROLLMENT_SUCCESS":
      return {
        ...state,
        loading: false,
        enrolledCourses: [...state.enrolledCourses, action.payload],
      };

    case "REMOVE_ENROLLMENT_SUCCESS":
      return {
        ...state,
        loading: false,
        enrolledCourses: state.enrolledCourses.filter(
          (course) => course._id !== action.payload
        ),
      };

    case "ENROLLMENT_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "ENROLLMENT_CLEAR_ERROR":
      return { ...state, error: null };

    default:
      return state;
  }
};
