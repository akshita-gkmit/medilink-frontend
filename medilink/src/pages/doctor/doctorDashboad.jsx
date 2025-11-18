import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../../services/apiHelper";
import API from "../../constants/apiEndpoints";
import "../../index.css";
import { useAuth } from "../../context/authContext";

const DoctorDashboard = () => {
  const { user, isLoading, logout } = useAuth();
  
  console.log("Auth Loading:", isLoading);
  console.log("User:", user);
  console.log("Doctor ID:", user?.doctorId);


  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
  if (isLoading) return;
  if (!user) return;
  if (!user.doctorId) return;

  fetchDoctorStats();
}, [isLoading, user]);

  const fetchDoctorStats = async () => {
    try {
      const res = await apiCall(
        "GET",
        `${API.DOCTOR_DASHBOARD}/${user.doctorId}`
      );
      setStats(res.data);
    } catch (error) {
      console.error("Failed to load doctor stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (isLoading || loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  // If doctor profile missing (should not happen)
  if (!user?.doctorId) {
    return (
      <div className="admin-container">
        <div className="loading">Doctor profile not found.</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-brand">MediLink Doctor</div>
        <div className="navbar-menu">
          <span className="navbar-user">Dr. {user?.name}</span>

          <button
            className="btn-secondary"
            onClick={() => navigate(`/doctor/${user.doctorId}/slots`)}
          >
            Manage Slots
          </button>

          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="content">
        <h1>Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Today's Appointments</h3>
            <p className="stat-number">{stats?.todayAppointments}</p>
          </div>

          <div className="stat-card">
            <h3>Total Patients</h3>
            <p className="stat-number">{stats?.totalPatients}</p>
          </div>

          <div className="stat-card">
            <h3>Upcoming Appointments</h3>
            <p className="stat-number">{stats?.upcomingAppointments}</p>
          </div>
        </div>

        {/* SHORTCUT BUTTONS */}
        <h2 className="mt-30">Quick Actions</h2>

        <div className="stats-grid">
          <button
            className="btn-primary"
            onClick={() => navigate(`/doctor/${user.doctorId}/slots`)}
            style={{ width: "100%" }}
          >
            Manage Appointment Slots
          </button>

          <button
            className="btn-secondary"
            onClick={() => navigate(`/doctor/${user.doctorId}/appointments`)}
            style={{ width: "100%" }}
          >
            View Appointments
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
