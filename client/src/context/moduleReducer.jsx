// src/context/moduleReducer.js

export const moduleInitialState = {
  modules: [],       // list of modules for the current course
  loading: false,    // loading state for any module API action
  error: null,       // error messages (if any)
  course: null,      // store course details (title, teacher info, etc.)
};

export const moduleReducer = (state, action) => {
  switch (action.type) {
    case "MODULES_FETCH_START":
      return { ...state, loading: true, error: null };

    case "MODULES_FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        modules: action.payload.modules,
        course: action.payload.course,
      };

    case "MODULES_FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "MODULE_ADD_SUCCESS":
      return {
        ...state,
        loading: false,
        modules: [...state.modules, action.payload],
      };

    case "MODULE_UPDATE_SUCCESS":
      return {
        ...state,
        loading: false,
        modules: state.modules.map((mod) =>
          mod._id === action.payload._id ? action.payload : mod
        ),
      };

    case "MODULE_DELETE_SUCCESS":
      return {
        ...state,
        loading: false,
        modules: state.modules.filter((mod) => mod._id !== action.payload),
      };

    case "MODULE_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "MODULE_CLEAR_ERROR":
      return { ...state, error: null };

    default:
      return state;
  }
};
