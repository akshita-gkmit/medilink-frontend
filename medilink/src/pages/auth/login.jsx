import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/auth.css';
import ROUTES from "../../constants/routes";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);

    console.log("LOGIN RESPONSE:", result);

    if (result?.access_token) {
      const userRole = result.role ? result.role.toLowerCase() : null;

      // Store login info
      localStorage.setItem("token", result.access_token);
      localStorage.setItem("role", userRole);
      localStorage.setItem("user_id", result.user_id);
      
      if (result.doctor_id) {
        localStorage.setItem("doctor_id", result.doctor_id);
      }
      console.log("LOGIN RESPONSE:", result);

      // Redirect based on role using ROUTES
      if (userRole?.toLowerCase() === "admin") {
        navigate(ROUTES.ADMIN_DASHBOARD);
      } 
      else if (userRole?.toLowerCase() === "doctor") {
        navigate(ROUTES.DOCTOR_DASHBOARD);
      } 
      else {
        navigate(ROUTES.USER_DASHBOARD);
      }
    } else {
      setError(result.error || "Invalid login credentials");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>MediLink</h1>
        <h2>Login</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
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
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
