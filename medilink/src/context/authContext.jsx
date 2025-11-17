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
      setUser(response?.data?.user || response?.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Token validation failed:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      localStorage.removeItem("user_id");
      localStorage.removeItem("doctor_id");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiPost(ROUTES.AUTH_LOGIN, { email, password });
      const accessToken = response?.data?.access_token;
      const role = response?.data?.role?.toLowerCase();
      const doctorId = response?.data?.doctor_id || null;
      const userId = response?.data?.user_id || null;

      if (!accessToken) {
        return { success: false, error: "Invalid server response" };
      }

      // SAVE tokens and user info
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("role", role);
      if (userId) localStorage.setItem("user_id", userId);
      if (doctorId) localStorage.setItem("doctor_id", doctorId);

      setUser({ role, user_id: userId, doctor_id: doctorId });
      setIsAuthenticated(true);

      return { success: true, role, user_id: userId, doctor_id: doctorId };
    } catch (error) {
      console.error("Login error:", error);
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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    localStorage.removeItem("doctor_id");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);