export const studentInitialState = {
  students: [],
  loading: false,
  error: null,
};

export const studentReducer = (state, action) => {
  switch (action.type) {
    ////////////////////////////////
    // Fetch all students
    ////////////////////////////////
    case "FETCH_STUDENTS_REQUEST":
      return { ...state, loading: true, error: null };

    case "FETCH_STUDENTS_SUCCESS":
      return { ...state, loading: false, students: action.payload };

    case "FETCH_STUDENTS_FAIL":
      return { ...state, loading: false, error: action.payload };

    ////////////////////////////////
    // Clear any stored error
    ////////////////////////////////
    case "CLEAR_STUDENT_ERROR":
      return { ...state, error: null };

    default:
      return state;
  }
};
