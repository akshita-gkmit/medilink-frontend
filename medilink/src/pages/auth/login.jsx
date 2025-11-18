import { useNavigate, Link } from 'react-router-dom';
import { useState } from "react";

import { ROLES } from "../../constants/roles";
import { useAuth } from "../../context/authContext";
import ROUTES from "../../constants/navigationPath";
import InputField from "../../components/inputField";
import "../../index.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setLoading(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (!result.success) {
        setError(
          typeof result.error === "string"
            ? result.error
            : JSON.stringify(result.error)
        );
        return;
      }

      setSuccess(`You are logged in as: ${result.role}`);

      // Redirect after 1.5 seconds
      setTimeout(() => {
        if (result.role === ROLES.ADMIN) {
          navigate(ROUTES.ADMIN_DASHBOARD);
        } else if (result.role === ROLES.DOCTOR) {
          navigate(ROUTES.DOCTOR_DASHBOARD);
        } else {
          navigate(ROUTES.USER_DASHBOARD);
        }
      }, 1500);

    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>MediLink</h1>
        <h2>Login</h2>
        {success && <p className="success-message">{success}</p>}
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>

          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            placeholder="Enter your email"
            onChange={(e) => handleChange(e)}
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            placeholder="Enter your password"
            onChange={(e) => handleChange(e)}
          />

          <button className="btn-primary" type="submit">Login</button>
        </form>

        <p className="auth-link">
          No account? <Link to={ROUTES.REGISTER}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
