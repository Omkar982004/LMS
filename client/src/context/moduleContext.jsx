// src/context/moduleContext.jsx

import { createContext, useReducer, useContext } from "react";
import { moduleReducer, moduleInitialState } from "./moduleReducer";
import API from "../api";

const ModuleContext = createContext();

export const ModuleProvider = ({ children }) => {
  const [state, dispatch] = useReducer(moduleReducer, moduleInitialState);

  //////////////////////////////////////////
  // Fetch all modules for a given course
  //////////////////////////////////////////
  const fetchModules = async (courseId) => {
    dispatch({ type: "MODULES_FETCH_START" });
    try {
      const res = await API.get(`/courses/${courseId}/modules`);
      dispatch({
        type: "MODULES_FETCH_SUCCESS",
        payload: {
          modules: res.data.modules,
          course: res.data.course,
        },
      });
    } catch (err) {
      dispatch({
        type: "MODULES_FETCH_ERROR",
        payload: err.response?.data?.message || "Error fetching modules",
      });
    }
  };

  //////////////////////////////////////////
  // Add new module
  //////////////////////////////////////////
  const addModule = async (courseId, title, content) => {
    dispatch({ type: "MODULES_FETCH_START" });
    try {
      const res = await API.post(`/courses/${courseId}/modules`, {
        title,
        content,
      });
      dispatch({ type: "MODULE_ADD_SUCCESS", payload: res.data.module });
    } catch (err) {
      dispatch({
        type: "MODULE_ERROR",
        payload: err.response?.data?.message || "Error adding module",
      });
    }
  };

  //////////////////////////////////////////
  // Update an existing module
  //////////////////////////////////////////
  const updateModule = async (courseId, moduleId, updatedData) => {
    dispatch({ type: "MODULES_FETCH_START" });
    try {
      const res = await API.put(
        `/courses/${courseId}/modules/${moduleId}`,
        updatedData
      );
      dispatch({ type: "MODULE_UPDATE_SUCCESS", payload: res.data.module });
    } catch (err) {
      dispatch({
        type: "MODULE_ERROR",
        payload: err.response?.data?.message || "Error updating module",
      });
    }
  };

  //////////////////////////////////////////
  // Delete a module
  //////////////////////////////////////////
  const deleteModule = async (courseId, moduleId) => {
    dispatch({ type: "MODULES_FETCH_START" });
    try {
      await API.delete(`/courses/${courseId}/modules/${moduleId}`);
      dispatch({ type: "MODULE_DELETE_SUCCESS", payload: moduleId });
    } catch (err) {
      dispatch({
        type: "MODULE_ERROR",
        payload: err.response?.data?.message || "Error deleting module",
      });
    }
  };

  //////////////////////////////////////////
  // Clear error
  //////////////////////////////////////////
  const clearError = () => dispatch({ type: "MODULE_CLEAR_ERROR" });

  return (
    <ModuleContext.Provider
      value={{
        ...state,
        fetchModules,
        addModule,
        updateModule,
        deleteModule,
        clearError,
      }}
    >
      {children}
    </ModuleContext.Provider>
  );
};

export const useModules = () => useContext(ModuleContext);
