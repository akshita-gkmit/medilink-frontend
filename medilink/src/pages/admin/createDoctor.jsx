import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../constants/apiEndpoints";
import ROUTES from "../../constants/navigationPath";
import { apiCall } from "../../services/apiHelper";
import "../../index.css";

const CreateDoctor = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    qualification: "",
    position: "",
    dob: "",
    chamber: "",
    start_time: "",
    end_time: "",
    consultation_fee: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e?.target?.name]: e?.target?.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await apiCall("POST", API.ADMIN_ADD_DOCTOR, form);
      setSuccess("Doctor created successfully!");

      setTimeout(() => navigate(ROUTES.ADMIN_DASHBOARD), 1200);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to create doctor");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: "500px" }}>
        <h1>Add Doctor</h1>

        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message" style={{ color: "green", textAlign: "center" }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <FormInput
            label="Doctor Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Specialization"
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
          />

          <FormInput
            label="Qualification"
            name="qualification"
            value={form.qualification}
            onChange={handleChange}
          />

          <FormInput
            label="Position"
            name="position"
            value={form.position}
            onChange={handleChange}
          />

          <FormInput
            label="DOB"
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
          />

          <FormInput
            label="Chamber"
            name="chamber"
            value={form.chamber}
            onChange={handleChange}
          />

          <FormInput
            label="Start Time"
            type="time"
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
          />

          <FormInput
            label="End Time"
            type="time"
            name="end_time"
            value={form.end_time}
            onChange={handleChange}
          />

          <FormInput
            label="Consultation Fee"
            type="number"
            name="consultation_fee"
            value={form.consultation_fee}
            onChange={handleChange}
          />
          <button type="button" className="btn-secondary" style={{ width: "100%", marginTop: "1rem" }} onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)} > Back to Dashboard </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDoctor;
