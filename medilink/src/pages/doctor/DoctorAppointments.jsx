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
        const res = await apiCall(
          "GET",
          `/doctor/${user.doctorId}/appointments`
        );
        setAppointments(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [user, isLoading]);

  const updateStatus = async (id, type) => {
  try {
    const res = await apiCall(
      "POST",
      "/doctor/appointments/update-status",
      {
        appointment_id: id,
        action: type,
        notes: ""
      }
    );

    alert(res.data.message);

    setAppointments(prev =>
      prev.map(a =>
        a.id === id ? { ...a, status: type } : a
      )
    );
  } catch (err) {
    console.error(err);
    alert("Failed to update appointment");
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
            {appointments.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.patient_name}</td>
                <td>{a.date}</td>
                <td>{a.start_time} - {a.end_time}</td>
                <td>{a.status}</td>

                <td>
                    {String(a.status).toLowerCase() === "pending" ? (
                        <>
                        <button
                            className="btn-delete"
                            onClick={() => updateStatus(a.id, "approve")}
                        >
                            Approve
                        </button>

                        <button
                            className="btn-delete"
                            onClick={() => updateStatus(a.id, "reject")}
                        >
                            Reject
                        </button>
                        </>
                    ) : (
                        <strong style={{ color: a.status === "approved" ? "green" : "red" }}>
                        {a.status}
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
