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

  // ✅ FIXED validateToken — matches backend response
  const validateToken = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await apiCall("GET", API.AUTH_VALIDATE_TOKEN);

      const {
        email,
        role,
        user_id,
        doctor_id,
      } = data || {};

      setUserDetails({
        email,
        role,
        userId: user_id,
        doctorId: doctor_id,
        name: data.name || "Doctor",
      });

      setIsAuthenticated(true);

    } catch (error) {
      localStorage.clear();
      setUserDetails(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Login (already fixed & destructured)
  const login = async (email, password) => {
    try {
      const { data } = await apiCall("POST", API.AUTH_LOGIN, { email, password });

      const {
        access_token,
        refresh_token,
        email: userEmail,
        role,
        userId,
        doctorId,
        name
      } = data || {};

      if (!access_token) {
        return { success: false, error: "Invalid server response" };
      }

      // Save tokens & role
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("role", role.toLowerCase());
      localStorage.setItem("userId", userId);
      if (doctorId) localStorage.setItem("doctorId", doctorId);

      // Save to state
      setUserDetails({
        email: userEmail,
        role,
        userId,
        doctorId,
        name,
      });

      setIsAuthenticated(true);

      return { success: true, role };

    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.clear();
    setUserDetails(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user: userDetails,
        userDetails,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
