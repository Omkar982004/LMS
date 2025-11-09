import { createContext, useContext, useReducer, useEffect } from "react";
import authReducer, { initialState } from "./authReducer";
import API from "../api"; // your axios instance

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user/token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      dispatch({
        type: "AUTH_SUCCESS",
        payload: {
          token: storedToken,
          user: JSON.parse(storedUser),
          message: "Session restored",
        },
      });
    }
  }, []);

  ///////////////////////////
  // Login
  ///////////////////////////
  const login = async (email, password) => {
    try {
      dispatch({ type: "AUTH_START" });

      const { data } = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      dispatch({
        type: "AUTH_SUCCESS",
        payload: {
          token: data.token,
          user: data.user,
          message: data.message,
        },
      });
    } catch (error) {
      dispatch({
        type: "AUTH_FAIL",
        payload: error.response?.data?.message || error.message,
      });
    }
  };

  ///////////////////////////
  // Signup
  ///////////////////////////
  const signup = async (name, email, password, role = "student") => {
    try {
      dispatch({ type: "AUTH_START" });

      const { data } = await API.post("/auth/signup", { name, email, password, role });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      dispatch({
        type: "AUTH_SUCCESS",
        payload: {
          token: data.token,
          user: data.user,
          message: data.message,
        },
      });
    } catch (error) {
      dispatch({
        type: "AUTH_FAIL",
        payload: error.response?.data?.message || error.message,
      });
    }
  };

  ///////////////////////////
  // Logout
  ///////////////////////////
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  ///////////////////////////
  // Context value
  ///////////////////////////
  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
