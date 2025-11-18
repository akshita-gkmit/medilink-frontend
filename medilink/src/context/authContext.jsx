import { createContext, useContext, useState, useEffect } from "react";

import { apiCall } from "../services/apiHelper";
import API from "../constants/apiEndpoints";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    validateToken();
  }, []);

  const validateToken = async () => {
    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiCall("GET", API.AUTH_VALIDATE_TOKEN);
      setUserDetails(response?.data?.user || response?.data);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      localStorage.removeItem("doctorId");
      setUserDetails(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiCall("Post", API.AUTH_LOGIN, { email, password });
      const {access_token, role, doctorId, userId} = response?.data || {};       

      if (!access_token) {
        return { success: false, error: "Invalid server response" };
      }

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("role", role?.toLowerCase());
      if (userId) localStorage.setItem("userId", userId);
      if (doctorId) localStorage.setItem("doctorId", doctorId);

      setUserDetails({ role, userId, doctorId });
      setIsAuthenticated(true);

      return { success: true, role, userId, doctorId };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Login failed",
      };
    }
  };

  const register = async (formData) => {
  try {
    const response = await apiPost(ROUTES.AUTH_REGISTER, {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      gender: formData.gender,
      dob: formData.dob,
      blood_group: formData.blood_group,
    });

    return {
      success: true,
      message: "Registration successful",
      data: response.data
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: error.response?.data?.detail || JSON.stringify(error.response?.data)
    };
  }
};


  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("doctorId");
    setUserDetails(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ userDetails, isAuthenticated, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);