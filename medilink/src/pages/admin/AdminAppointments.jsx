import { useEffect, useState } from "react";

import { apiCall } from "../../services/apiHelper";
import API from "../../constants/apiEndpoints";
import "../../index.css";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);

  const load = async () => {
    try{
        const res = await apiCall("GET", API.ADMIN_ALL_APPOINTMENTS);
    setAppointments(res.data || []);
    } catch (err) {
    setError(err.message);
  }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="table-container">
      <table className="simple-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>{appointments.map((appt) => (
            <tr key={appt.id}>
                <td>{appt.id}</td>
                <td>{appt.patient_name}</td>
                <td>{appt.doctor_name}</td>
                <td>{appt.date}</td>
                <td>{appt.start_time} - {appt.end_time}</td>
                <td>{appt.status}</td>
            </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
