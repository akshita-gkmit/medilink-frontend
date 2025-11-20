import { useEffect, useState } from "react";

import { useAuth } from "../../context/authContext";
import { apiCall } from "../../services/apiHelper";
import API from "../../constants/apiEndpoints";
import "../../index.css";

export default function DoctorAppointments() {
  const { user, isLoading } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (isLoading || !user?.doctorId) return;

    const load = async () => {
      try {
        const response = await apiCall(
          "GET", API.DOCTOR_APPOINTMENTS(user.doctorId));
        setAppointments(response?.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [user, isLoading]);

  const updateStatus = async (appointmentId, actionType) => {
  try {
    const response = await apiCall("POST", API.DOCTOR_APPOINTMENT_UPDATE,
      {
        appointment_id: appointmentId,
        action: actionType,
        notes: ""
      }
    );
    alert(response?.data?.message);
    setAppointments(previousAppointments =>
      previousAppointments.map(appointment =>
        appointment.id === appointmentId
          ? { ...appointment, status: actionType }
          : appointment
      )
    );

  } catch (err) {
    console.error(err);

    const backendMessage =
      err?.response?.data?.message ||
      err?.response?.data?.detail ||
      "Something went wrong";

    alert(backendMessage);
  }
};

  return (
    <div className="admin-container">
      <h1>Appointment Requests</h1>
      <div className="table-container">
        <table className="simple-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments?.map((appointment) => (
              <tr key={appointment?.id}>
                <td>{appointment?.id}</td>
                <td>{appointment?.patient_name}</td>
                <td>{appointment?.date}</td>
                <td>{appointment?.start_time} - {appointment?.end_time}</td>
                <td>{appointment?.status}</td>
                <td>
                  {String(appointment.status).toLowerCase() === "pending" ? (
                    <>
                      <button
                        className="btn-delete"
                        onClick={() => updateStatus(appointment?.id, "approve")}
                      >
                        Approve
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() => updateStatus(appointment?.id, "reject")}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <strong
                      style={{
                        color: appointment?.status === "approved" ? "green" : "red", }}>
                      {appointment?.status}
                    </strong>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
