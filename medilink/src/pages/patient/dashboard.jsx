import { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { apiCall } from "../../services/apiHelper";
import API from "../../constants/apiEndpoints";
import DoctorList from "./DoctorList";
import AppointmentList from "./appointments_list";
import BookAppointment from "./bookAppointment";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../constants/navigationPath";
import HistoryList from "./HistoryList";

const PatientDashboard = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);

  // ------------------ LOAD HISTORY ------------------
  const loadHistory = async () => {
    if (!user?.patientId) return;

    try {
      const res = await apiCall(
        "GET",
        `/patient/appointments/history/${user.patientId}`
      );
      setHistory(res.data || []);
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  };

  // ------------------ LOGOUT ------------------
  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  // ------------------ LOAD DOCTORS ------------------
  const loadDoctors = async () => {
    try {
      const res = await apiCall("GET", API.GET_ALL_DOCTORS);
      setDoctors(res.data || []);
    } catch (error) {
      console.error("Failed to load doctors:", error);
    }
  };

  // ------------------ LOAD APPOINTMENTS ------------------
  const loadAppointments = async () => {
    if (!user?.patientId) return; // IMPORTANT FIX

    try {
      const res = await apiCall(
        "GET",
        `${API.PATIENT_APPOINTMENTS}/${user.patientId}`
      );
      setAppointments(res.data || []);
    } catch (error) {
      console.error("Failed to load appointments:", error);
    }
  };

  // ------------------ INITIAL LOAD ------------------
  useEffect(() => {
    if (isLoading) return;

    if (user) {
      loadDoctors();
      loadAppointments();
    }
  }, [isLoading, user]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="admin-container">
      <nav className="navbar">
        <div className="navbar-brand">MediLink Patient</div>

        <div className="navbar-menu">
          <span className="navbar-user">{user?.name}</span>

          <button
            className="btn-secondary"
            onClick={() => {
              loadHistory();
              setShowHistory(true);
            }}
          >
            View Appointment History
          </button>

          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="content">
        <h2>Your Appointments</h2>
        <AppointmentList
          appointments={appointments}
          refresh={loadAppointments}
        />

        <h2 className="mt-30">Available Doctors</h2>
        <DoctorList doctors={doctors} onSelectDoctor={setSelectedDoctor} />

        {selectedDoctor && (
          <BookAppointment
            doctor={selectedDoctor}
            close={() => setSelectedDoctor(null)}
            refreshAppointments={loadAppointments}
          />
        )}

        {showHistory && (
          <HistoryList
            history={history}
            close={() => setShowHistory(false)}
          />
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
