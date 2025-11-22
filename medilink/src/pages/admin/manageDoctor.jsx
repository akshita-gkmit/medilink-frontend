import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import API from '../../constants/apiEndpoints';
import { apiCall } from '../../services/apiHelper';
import ROUTES from '../../constants/navigationPath';
import { useAuth } from '../../context/authContext';
import '../../index.css';

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
      const response = await apiCall("GET", API.ADMIN);
      setDoctors(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (doctorId) => {
    if (!window.confirm(`Are you sure you want to delete doctor ID: ${doctorId}?`)) return;

    setDeleteLoading(doctorId);
    setError('');
    setSuccess('');

    try {
      const res = await apiCall("PATCH", `${API.ADMIN_DOCTOR_DELETE}/${doctorId}`);
      setSuccess("Doctor soft deleted successfully");
      fetchDoctors();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to delete doctor");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
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

          <button
            onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
            className="btn-secondary"
          >
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

        {doctors?.length === 0 ? (
          <div className="empty-state">No doctors found</div>
        ) : (
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
                    <td>{doctor.specialization || 'N/A'}</td>
                    <td>{doctor.position || 'N/A'}</td>

                    <td className="action-buttons">
                      <button
                        onClick={() => navigate(`/admin/doctors/${doctor.id}`, { state: doctor })}
                        className="btn-view"
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleDelete(doctor.id)}
                        className="btn-delete"
                        disabled={deleteLoading === doctor.id}
                      >
                        {deleteLoading === doctor.id ? "Deleting..." : "Delete"}
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