import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/axios';
import '../../styles/admin.css';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
  try {
    const response = await api.get("/admin/");

    console.log("RAW RESPONSE:", response.data); //🔥 check what you get

    setDoctors(Array.isArray(response.data) ? response.data : []);
  } catch (err) {
    console.log("ERROR:", err.response?.data);
    setError("Failed to load doctors");
  } finally {
    setLoading(false);
  }
};


  const handleDelete = async (email) => {
    if (!window.confirm(`Are you sure you want to delete doctor: ${email}?`)) {
      return;
    }

    setDeleteLoading(email);
    setError('');
    setSuccess('');

    try {
      await api.patch(`/admin/doctor/delete/${email}`, {}, {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

      setSuccess('Doctor deleted successfully');
      fetchDoctors();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete doctor');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading doctors...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <nav className="navbar">
        <div className="navbar-brand">MediLink Admin</div>
        <div className="navbar-menu">
          <span className="navbar-user">Welcome, {user?.username}</span>
          <button onClick={() => navigate('/admin/dashboard')} className="btn-secondary">
            Dashboard
          </button>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>

      <div className="content">
        <h1>Manage Doctors</h1>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        {doctors.length === 0 ? (
          <div className="empty-state">No doctors found</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Specialization</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor.email || doctor._id}>
                    <td>{doctor.name || doctor.username}</td>
                    <td>{doctor.email}</td>
                    <td>{doctor.specialization || 'N/A'}</td>
                    <td>{doctor.phone || 'N/A'}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(doctor.email)}
                        className="btn-delete"
                        disabled={deleteLoading === doctor.email}
                      >
                        {deleteLoading === doctor.email ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
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

export default ManageDoctors;