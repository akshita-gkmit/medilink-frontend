import { Link } from "react-router-dom";
import "../styles/auth.css";   // CORRECT PATH

export default function LandingPage() {
  return (
    <div className="page-wrapper">
      <div className="auth-card">
        <h1>MediLink – Smart Healthcare Management</h1>
        <p>Your unified platform for connecting Admins, Doctors, and Patients.</p>

        <div style={{ marginTop: "40px" }}>
          <Link to="/login">
            <button className="auth-btn">Login</button>
          </Link>

          <Link to="/register">
            <button className="auth-btn" style={{ marginLeft: "20px" }}>
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
