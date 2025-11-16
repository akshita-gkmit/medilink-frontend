// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",   // your FastAPI backend
  withCredentials: false
});

export default api;
