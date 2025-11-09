export const initialCourseState = {
  courses: [],
  loading: false,
  error: null,
};

export const courseReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_COURSES_START":
      return { ...state, loading: true, error: null };

    case "FETCH_COURSES_SUCCESS":
      return { ...state, loading: false, courses: action.payload };

    case "FETCH_COURSES_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "ADD_COURSE":
      return { ...state, courses: [...state.courses, action.payload] };

    default:
      return state;
  }
};
