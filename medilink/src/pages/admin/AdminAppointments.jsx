import { useEffect, useState } from "react";

import { apiCall } from "../../services/apiHelper";
import API from "../../constants/apiEndpoints";
import "../../index.css";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);

  const getDoctorAppointments = async () => {
    try{
        const res = await apiCall("GET", API.ADMIN_ALL_APPOINTMENTS);
    setAppointments(res.data || []);
    } catch (err) {
    setError(err.message);
  }
  };

  useEffect(() => {
    getDoctorAppointments();
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
        <tbody>
          {appointments.map(({ id, patient_name, doctor_name, date, start_time, end_time, status }) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{patient_name}</td>
              <td>{doctor_name}</td>
              <td>{date}</td>
              <td>{start_time} - {end_time}</td>
              <td>{status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
