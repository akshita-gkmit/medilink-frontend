import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../constants/apiEndpoints";
import ROUTES from "../../constants/navigationPath";
import { apiCall } from "../../services/apiHelper";
import { useAuth } from "../../context/authContext";
import "../../index.css";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [doctorLoading, setDoctorLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
    fetchDoctors();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await apiCall("GET", API.ADMIN_DASHBOARD);
      const data = res.data;

      setDashboardData({
        totalDoctors: data?.total_doctors,
        totalPatients: data?.total_users,
        totalAppointments: data?.total_appointments,
        pendingRequests: data?.pending_requests || 0,
      });
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await apiCall("GET", API.ADMIN_LIST_DOCTOR);
      setDoctors(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError("Failed to load doctors");
    } finally {
      setDoctorLoading(false);
    }
  };

  const handleDelete = async (doctor_id) => {
    try {
      const res = await apiCall("patch", `${API.ADMIN_DOCTOR_DELETE}/${doctor_id}`);
      alert(res.data.message);

      setDoctors(prev =>
        prev.map(d =>
          d.id === doctor_id ? { ...d, is_active: false } : d
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete doctor");
    }
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  if (isLoading || doctorLoading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <nav className="navbar">
        <div className="navbar-brand">MediLink Admin</div>
        <div className="navbar-menu">
          <span className="navbar-user">Welcome, {user?.name}</span>
          <button
            onClick={() => navigate(ROUTES.ADMIN_ADD_DOCTOR)}
            className="btn-secondary"
          >
            Add Doctor
          </button>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>

      <div className="content">
        <h1>Dashboard</h1>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Doctors</h3>
            <p className="stat-number">{dashboardData?.totalDoctors}</p>
          </div>
          <div className="stat-card">
            <h3>Total Patients</h3>
            <p className="stat-number">{dashboardData?.totalPatients}</p>
          </div>
          <div className="stat-card">
            <h3>Total Appointments</h3>
            <p className="stat-number">{dashboardData?.totalAppointments}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Requests</h3>
            <p className="stat-number">{dashboardData?.pendingRequests}</p>
          </div>
        </div>

        <h2 className="mt-30">Manage Doctors</h2>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Specialization</th>
                <th>Position</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {doctors?.map((doctor) => (
                <tr key={doctor.id}>
                  <td>{doctor.id}</td>
                  <td>{doctor.name}</td>
                  <td>{doctor.specialization}</td>
                  <td>{doctor.position}</td>
                  <td>{doctor.deleted_at}</td>

                  <td className="action-buttons">
                    <button
                      onClick={() =>
                         navigate(`/doctor/${doctor.id}`)
                      }
                      className="btn-view"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/admin/doctor/update/${doctor.id}`)}
                      className="btn-secondary"
                    >
                      Update
                    </button>

                    <button
                      onClick={() => handleDelete(doctor.id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;