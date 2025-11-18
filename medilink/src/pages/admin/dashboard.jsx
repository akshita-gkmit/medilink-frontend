import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import API from "../../constants/apiEndpoints";
import ROUTES from "../../constants/navigationPath";
import { apiCall } from "../../services/apiHelper";
import { useAuth } from "../../context/authContext";
import '../../index.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await apiCall("GET", API.ADMIN_DASHBOARD);
      setDashboardData(response?.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  if (isLoading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  const stats = [
    { label: "Total Doctors", value: dashboardData?.totalDoctors || 0 },
    { label: "Total Appointments", value: dashboardData?.totalAppointments || 0 },
    { label: "Total Patients", value: dashboardData?.totalPatients || 0 },
    { label: "Pending Requests", value: dashboardData?.pendingRequests || 0 },
  ];

  return (
    <div className="admin-container">
      <nav className="navbar">
        <div className="navbar-brand">MediLink Admin</div>
        <div className="navbar-menu">
          <span className="navbar-user">Welcome, {user?.name}</span>
          <button onClick={() => navigate(ROUTES.ADMIN)} className="btn-secondary">
            Manage Doctors
          </button>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>

      <div className="content">
        <h1>Dashboard</h1>

        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="stats-grid">
            {stats.map((item, index) => (
              <div className="stat-card" key={index}>
                <h3>{item.label}</h3>
                <p className="stat-number">{item.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
