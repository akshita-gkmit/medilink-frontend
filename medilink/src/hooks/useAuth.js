import axios from "axios";

export const useAuth = () => {
  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:8000/auth/login", {
        email,
        password,
      });

      return {
        success: true,
        access_token: res.data.access_token,
        role: res.data.role,
        user_id: res.data.user_id,
        doctor_id: res.data.doctor_id,
      };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || "Login failed",
      };
    }
  };

  return { login };
};
