import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../constants/apiEndpoints";
import { apiCall } from "../../services/apiHelper";
import ROUTES from "../../constants/navigationPath";
import "../../index.css";

const UpdateDoctor = () => {
  const { doctor_id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchDoctor();
  }, []);

  const fetchDoctor = async () => {
    try {
      const res = await apiCall("GET", `${API.GET_DOCTOR}/${doctor_id}`);
      setForm(res.data);
    } catch (e) {
      setMsg("Failed to load doctor details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      apiCall("PATCH", `${API.ADMIN_UPDATE_DOCTOR}/${doctor_id}`, form)

      setMsg("Doctor updated successfully!");

      setTimeout(() => navigate(ROUTES.ADMIN_DASHBOARD), 1000);
    } catch (e) {
      setMsg("Failed to update");
    }
  };

  if (loading) return <div className="loading">Loading doctor...</div>;

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: "500px" }}>
        <h1>Update Doctor</h1>

        {msg && <div className="error-message">{msg}</div>}

        <form onSubmit={handleUpdate}>
          {/* NAME */}
          <div className="form-group">
            <label>Doctor Name</label>
            <input
              type="text"
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              required
            />
          </div>

          {/* EMAIL (DISABLED) */}
          <div className="form-group">
            <label>Email (Cannot Change)</label>
            <input
              type="email"
              value={form.email || ""}
              disabled
              style={{ background: "#eee", cursor: "not-allowed" }}
            />
          </div>

          <div className="form-group">
            <label>Specialization</label>
            <input
              type="text"
              name="specialization"
              value={form.specialization || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Qualification</label>
            <input
              type="text"
              name="qualification"
              value={form.qualification || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Position</label>
            <input
              type="text"
              name="position"
              value={form.position || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>DOB</label>
            <input
              type="date"
              name="dob"
              value={form.dob || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Chamber</label>
            <input
              type="text"
              name="chamber"
              value={form.chamber || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Start Time</label>
            <input
              type="time"
              name="start_time"
              value={form.start_time || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>End Time</label>
            <input
              type="time"
              name="end_time"
              value={form.end_time || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Consultation Fee</label>
            <input
              type="number"
              name="consultation_fee"
              value={form.consultation_fee || ""}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn-primary">
            Update Doctor
          </button>

          <button
            type="button"
            className="btn-secondary"
            style={{ width: "100%", marginTop: "1rem" }}
            onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateDoctor;
