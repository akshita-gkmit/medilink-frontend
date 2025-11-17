import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import api from '../../services/axios';
import '../../styles/admin.css';
import ROUTES from "../../constants/routes";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [docLoading, setDocLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
    fetchDoctors();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get(ROUTES.ADMIN_DASHBOARD);
      setDashboardData(response.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await api.get("/admin/");
      setDoctors(response.data);
    } catch (err) {
      setError("Failed to load doctors list");
    } finally {
      setDocLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  if (loading || docLoading) {
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
          <span className="navbar-user">Welcome, {user?.username}</span>

          <button 
            onClick={() => navigate(ROUTES.ADMIN_DOCTORS)} 
            className="btn-secondary"
          >
                  Manage Doctors
          </button>


          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div className="content">
        <h1>Dashboard</h1>

        {error && <div className="error-message">{error}</div>}

        {/* Dashboard Stats */}
        {dashboardData && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Doctors</h3>
              <p className="stat-number">{dashboardData?.total_doctors}</p>
            </div>
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-number">{dashboardData?.total_users}</p>
            </div>
            <div className="stat-card">
              <h3>Total Appointments</h3>
              <p className="stat-number">{dashboardData?.total_appointments}</p>
            </div>
          </div>
        )}

        {/* Doctor List Table */}
        <h2 style={{ marginTop: "40px" }}>Doctors List</h2>

        {doctors.length === 0 ? (
          <div className="empty-state">No doctors found</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {doctors.map((doctor, index) => (
                  <tr key={doctor.id}>
                    <td>{index + 1}</td>
                    <td>{doctor.name}</td>
                    <td>{doctor.specialization}</td>
                    <td>{doctor.status ? "Active" : "Inactive"}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
