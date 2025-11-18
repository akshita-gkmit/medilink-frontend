import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import ROUTES from "../../constants/navigationPath";
import InputField from "../../components/inputField";
import { useAuth } from "../../context/authContext";
import "../../index.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dob: '',
    blood_group: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // VALIDATIONS
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.gender) {
      setError('Please select a gender');
      return;
    }

    if (!formData.dob) {
      setError('Please enter your date of birth');
      return;
    }

    setLoading(true);

    // Remove confirmPassword before sending to backend
    const { confirmPassword, ...userData } = formData;

    const result = await register(userData);  // sends correct body

    if (result.success) {
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate(ROUTES.LOGIN), 2000);
    } else {
      // Ensure error is always a string
      setError(
        typeof result.error === "string"
          ? result.error
          : JSON.stringify(result.error)
      );
    }

    setLoading(false);
  };

  const genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" }
  ];
  const bloodGroups = [
    { value: "", label: "Select Blood Group (Optional)" },
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
  ];

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>MediLink</h1>
        <h2>Register</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          
          <InputField
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            placeholder="Enter your full name"
            onChange={handleChange}
            required
          />

          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            placeholder="Enter your email"
            onChange={handleChange}
            required
          />

          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              {genderOptions.map((opt, index) => (
                <option key={index} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>


          <InputField
            label="Date of Birth"
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />

          <div className="form-group">
            <label>Blood Group</label>
            <select
              name="blood_group"
              value={formData.blood_group}
              onChange={handleChange}
            >
              {bloodGroups.map((item, index) => (
                <option key={index} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>


          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            placeholder="Enter your password"
            onChange={handleChange}
            required
          />

          <InputField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            placeholder="Confirm your password"
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to={ROUTES.LOGIN}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
