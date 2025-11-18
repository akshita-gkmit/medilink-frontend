import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../services/api';
import '../../index.css';
import ROUTES from "../../constants/routes";



const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
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

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  if (loading) {
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
          <button onClick={() => navigate('/admin/doctors')} className="btn-secondary">
            Manage Doctors
          </button>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>

      <div className="content">
        <h1>Dashboard</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        {dashboardData && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Doctors</h3>
              <p className="stat-number">{dashboardData.totalDoctors || 0}</p>
            </div>
            
            <div className="stat-card">
              <h3>Total Appointments</h3>
              <p className="stat-number">{dashboardData.totalAppointments || 0}</p>
            </div>
            
            <div className="stat-card">
              <h3>Total Patients</h3>
              <p className="stat-number">{dashboardData.totalPatients || 0}</p>
            </div>
            
            <div className="stat-card">
              <h3>Pending Requests</h3>
              <p className="stat-number">{dashboardData.pendingRequests || 0}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;