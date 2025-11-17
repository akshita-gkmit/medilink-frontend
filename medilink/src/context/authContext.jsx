import { createContext, useContext, useState, useEffect } from "react";

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
    const response = await apiPost(ROUTES.LOGIN, { email, password });

    // Backend returns access_token and role
    const accessToken = response?.data?.access_token;
    const role = response?.data?.role;
    const doctorId = response?.data?.doctor_id || null;
    const userId = response?.data?.user_id || null;

    if (!accessToken || !role) {
      return { success: false, error: "Invalid server response" };
    }

    const loggedInUser = {
      role,
      user_id: userId,
      doctor_id: doctorId,
    };

    // Save the token correctly
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("role", loggedInUser.role);

    setUser(loggedInUser);
    setIsAuthenticated(true);

    return {
      success: true,
      role,
      user_id: userId,
      doctor_id: doctorId,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.detail || "Login failed",
    };
  }
};


  const register = async (userData) => {
    try {
      const response = await apiPost(ROUTES.REGISTER, userData);
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
export const useAuth = () => useContext(AuthContext);