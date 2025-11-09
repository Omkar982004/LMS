export const initialState = {
  user: null,          // Will store { id, name, email, role }
  token: null,         // JWT from backend
  loading: false,      // True while logging in or signing up
  error: null,         // Any error message from server
  message: null,       // “Login successful” / “Signup successful”
  isAuthenticated: false, // Derived from having a valid token
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, loading: true, error: null, message: null };

    case "AUTH_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        message: action.payload.message,
        isAuthenticated: true,
      };

    case "AUTH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "LOGOUT":
      return { ...initialState };

    default:
      return state;
  }
};

export default authReducer;
