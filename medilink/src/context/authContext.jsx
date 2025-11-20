import { createContext, useContext, useState, useEffect } from "react";
import { apiCall } from "../services/apiHelper";
import API from "../constants/apiEndpoints";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const loadPatientId = async (userId) => {
    try {
      const res = await apiCall("GET", `/patient/by-user/${userId}`);
      return res.data.patient_id;
    } catch (err) {
      console.error("Failed to fetch patientId");
      return null;
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) validateToken();
    else setLoading(false);
  }, []);

  const validateToken = async () => {
    try {
      const { data } = await apiCall("GET", API.AUTH_VALIDATE_TOKEN);

      const {
        email,
        role,
        userId,
        doctorId,
        name,
      } = data || {};

      let patientId = null;
      if (role === "patient") {
        patientId = await loadPatientId(userId);
      }

      // Build user object
      const userObject = {
        email,
        role,
        userId,
        doctorId,
        patientId, 
        name,
      };

      setUserDetails(userObject);
      setIsAuthenticated(true);

    } catch (error) {
      console.error("Token validation failed:", error);
      localStorage.clear();
      setUserDetails(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };


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

      // Save tokens to local storage
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("role", role.toLowerCase());
      localStorage.setItem("userId", userId);
      if (doctorId) localStorage.setItem("doctorId", doctorId);

      await validateToken();

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