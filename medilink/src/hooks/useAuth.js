import { useEffect, useState } from "react";

export const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = () => {
  const token = localStorage.getItem("token");
  setIsAuthenticated(!!token);
  setLoading(false);
};

useEffect(() => {
  checkAuthStatus();
}, []);

  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.detail };
      }

      // Save login details
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);

      setIsAuthenticated(true);

      return {
        success: true,
        access_token: data.access_token,
        role: data.role,
        user_id: data.user_id,
        doctor_id: data.doctor_id,
      };
    } catch (error) {
      return { success: false, error: "Server error" };
    }
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  return { login, logout, isAuthenticated, loading };
};
