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

          <div className="form-group">
            <label>Doctor Name *</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Specialization</label>
            <input type="text" name="specialization" value={form.specialization} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Qualification</label>
            <input type="text" name="qualification" value={form.qualification} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Position</label>
            <input type="text" name="position" value={form.position} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>DOB</label>
            <input type="date" name="dob" value={form.dob} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Chamber</label>
            <input type="text" name="chamber" value={form.chamber} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Start Time</label>
            <input type="time" name="start_time" value={form.start_time} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>End Time</label>
            <input type="time" name="end_time" value={form.end_time} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Consultation Fee</label>
            <input type="number" name="consultation_fee" value={form.consultation_fee} onChange={handleChange} />
          </div>

          <button type="submit" className="btn-primary">
            Create Doctor
          </button>

          <button
            type="button"
            className="btn-secondary"
            style={{ width: "100%", marginTop: "1rem" }}
            onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
          >
            Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDoctor;
