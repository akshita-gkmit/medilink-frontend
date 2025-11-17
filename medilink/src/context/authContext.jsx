import React, { createContext, useState, useEffect } from "react";
import { apiGet, apiPost } from "../services/apiHelper";
import ROUTES from "../constants/routes";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    validateToken();
  }, []);

  const validateToken = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiGet(ROUTES.AUTH_VALIDATE_TOKEN);

      setUser(response?.data?.user);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem("accessToken");
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiPost(ROUTES.AUTH_LOGIN, { email, password });

      const accessToken = response?.data?.accessToken;
      const loggedInUser = response?.data?.user;

      if (!accessToken || !loggedInUser) {
        return { success: false, error: "Invalid server response" };
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("role", loggedInUser.role);

      setUser(loggedInUser);
      setIsAuthenticated(true);

      return {
        success: true,
        role: loggedInUser.role,
        user_id: loggedInUser.user_id,
        doctor_id: loggedInUser.doctor_id,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiPost(ROUTES.AUTH_REGISTER, userData);
      return { success: true, message: response?.data?.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        validateToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
