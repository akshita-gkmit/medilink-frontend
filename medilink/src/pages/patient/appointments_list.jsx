import React from "react";
import { apiCall } from "../../services/apiHelper";
import API from "../../constants/apiEndpoints";

export default function AppointmentList({ appointments, refresh }) {
  
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await apiCall("DELETE", `${API.CANCEL_APPOINTMENT}/${id}`);
      refresh(); // reload list
    } catch (err) {
      console.error("Cancel failed", err);
      alert(err.response?.data?.detail || "Cancel failed");
    }
  };

  return (
    <div className="stats-grid">
      {appointments.map((appt) => (
        <div key={appt.id} className="stat-card">
          <h3>{appt.doctor_name}</h3>
          <p>Date: {appt.date}</p>
          <p>Time: {appt.start_time} - {appt.end_time}</p>
          <p>Status: {appt.status}</p>

          <button
            className="btn-secondary"
            onClick={() => handleCancel(appt.id)}
          >
            Cancel Appointment
          </button>
        </div>
      ))}
    </div>
  );
}
