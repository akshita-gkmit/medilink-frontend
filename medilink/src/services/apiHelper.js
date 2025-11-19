import api from "./api";


export const apiCall = (method, url, data, config = {}) => {
  try{
  return api({
    method,
    url,
    data,
    ...config
  });
} catch (error) {
    if (error.response) {
      throw {
        message: error?.response?.data?.detail || "Something went wrong",
        status: error?.response?.status
      };
    } else {
      throw { message: "Server not reachable", status: 0 };
    }
  }
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
