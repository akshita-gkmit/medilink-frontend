import { useEffect, useState } from "react";

import { useAuth } from "../../context/authContext";
import { apiCall } from "../../services/apiHelper";
import "../../index.css";

export default function DoctorAppointments() {
  const { user, isLoading } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (isLoading || !user?.doctorId) return;

    const fetchDoctorAppointments = async () => {
      try {
        const response = await apiCall(
          "GET", API.DOCTOR_APPOINTMENTS(user.doctorId));
        setAppointments(response?.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDoctorAppointments();
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
const headers = [
  { label: 'ID', key: 'id' },
  { label: 'Patient', key: 'patient_name' },
  { label: 'Date', key: 'date' },
  { label: 'Time', key: 'time' },
  { label: 'Status', key: 'status' },
  { label: 'Action', key: 'action' },
];

return (
  <div className="admin-container">
    <h1>Appointment Requests</h1>
    <div className="table-container">
      <table className="simple-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header.key}>{header.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {appointments?.map((appointment) => (
            <tr key={appointment?.id}>
              {headers.map((header) => (
                <td key={header.key}>
                  {header.key === 'time'
                    ? `${appointment?.start_time} - ${appointment?.end_time}`
                    : header.key === 'action'
                    ? (
                        <div>
                          {String(appointment.status).toLowerCase() === 'pending' ? (
                            <>
                              <button
                                className="btn-approve"
                                onClick={() => updateStatus(appointment?.id, "approve")}
                              >
                                Approve
                              </button>
                              <button
                                className="btn-reject"
                                onClick={() => updateStatus(appointment?.id, "reject")}
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <strong
                              style={{
                                color: appointment?.status === 'approved' ? 'green' : 'red',
                              }}
                            >
                              {appointment?.status}
                            </strong>
                          )}
                        </div>
                      )
                    : appointment[header.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
}

