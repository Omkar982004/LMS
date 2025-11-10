export const initialState = {
  user: null,          // { id, name, email, role }
  token: null,         // JWT from backend
  loading: false,      // During login/signup
  authLoading: true,   // True while restoring session on refresh
  error: null,
  message: null,
  isAuthenticated: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, loading: true, error: null, message: null };

    case "AUTH_SUCCESS":
      return {
        ...state,
        loading: false,
        authLoading: false,
        user: action.payload.user,
        token: action.payload.token,
        message: action.payload.message,
        isAuthenticated: true,
      };

    case "RESTORE_SESSION":
      return {
        ...state,
        authLoading: false,
        user: action.payload.user,
        token: action.payload.token,
        message: action.payload.message,
        isAuthenticated: true,
      };

    case "AUTH_LOADING_DONE":
      return { ...state, authLoading: false };

    case "AUTH_FAIL":
      return { ...state, loading: false, authLoading: false, error: action.payload };

    case "LOGOUT":
      return { ...initialState, authLoading: false };

    default:
      return state;
  }
};

export default authReducer;
