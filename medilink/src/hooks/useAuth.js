import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

export const useAuth = () => {
  const register = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, formData);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.detail || "Registration failed" };
  }
};


  return { register };
};
