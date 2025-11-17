import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import '../../index.css';
import { useAuth } from "../../context/authContext";
import ROUTES from "../../constants/routes";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        alert(`Logged in as: ${result.role}`);
        
        if (result.role === "admin") navigate(ROUTES.ADMIN_DASHBOARD);
        else if (result.role === "doctor") navigate(ROUTES.DOCTOR_DASHBOARD);
        else navigate(ROUTES.USER_DASHBOARD);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>MediLink</h1>
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <button className="btn-primary" type="submit">Login</button>
        </form>

        <p className="auth-link">
          No account? <Link to={ROUTES.AUTH_REGISTER}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
