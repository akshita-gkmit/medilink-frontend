// import { useEffect, useState } from "react";

// import { useAuth } from "../../context/authContext";
// import { apiCall } from "../../services/apiHelper";
// import "../../index.css";
// import API from "../../constants/apiEndpoints";
// export default function DoctorAppointments() {
//   const { user, isLoading } = useAuth();
//   const [appointments, setAppointments] = useState([]);

//   useEffect(() => {
//     if (isLoading || !user?.doctorId) return;

//     const fetchDoctorAppointments = async () => {
//       try {
//         const response = await apiCall(
//           "GET", API.DOCTOR_APPOINTMENTS(user.doctorId));
//         setAppointments(response?.data || []);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchDoctorAppointments();
//   }, [user, isLoading]);

//   const updateStatus = async (appointmentId, actionType) => {
//   try {
//     const response = await apiCall("POST", API.DOCTOR_APPOINTMENT_UPDATE,
//       {
//         appointment_id: appointmentId,
//         action: actionType,
//         notes: ""
//       }
//     );
//     alert(response?.data?.message);
//     setAppointments(previousAppointments =>
//       previousAppointments.map(appointment =>
//         appointment.id === appointmentId
//           ? { ...appointment, status: actionType }
//           : appointment
//       )
//     );

//   } catch (err) {
//     console.error(err);

//     const backendMessage =
//       err?.response?.data?.message ||
//       err?.response?.data?.detail ||
//       "Something went wrong";

//     alert(backendMessage);
//   }
// };
// const headers = [
//   { label: 'ID', key: 'id' },
//   { label: 'Patient', key: 'patient_name' },
//   { label: 'Date', key: 'date' },
//   { label: 'Time', key: 'time' },
//   { label: 'Status', key: 'status' },
//   { label: 'Action', key: 'action' },
// ];

// return (
//   <div className="admin-container">
//     <h1>Appointment Requests</h1>
//     <div className="table-container">
//       <table className="simple-table">
//         <thead>
//           <tr>
//             {headers.map((header) => (
//               <th key={header.key}>{header.label}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {appointments?.map((appointment) => (
//             <tr key={appointment?.id}>
//               {headers.map((header) => (
//                 <td key={header.key}>
//                   {header.key === 'time'
//                     ? `${appointment?.start_time} - ${appointment?.end_time}`
//                     : header.key === 'action'
//                     ? (
//                         <div>
//                           {String(appointment.status).toLowerCase() === 'pending' ? (
//                             <>
//                               <button
//                                 className="btn-approve"
//                                 onClick={() => updateStatus(appointment?.id, "approve")}
//                               >
//                                 Approve
//                               </button>
//                               <button
//                                 className="btn-reject"
//                                 onClick={() => updateStatus(appointment?.id, "reject")}
//                               >
//                                 Reject
//                               </button>
//                             </>
//                           ) : (
//                             <strong
//                               style={{
//                                 color: appointment?.status === 'approved' ? 'green' : 'red',
//                               }}
//                             >
//                               {appointment?.status}
//                             </strong>
//                           )}
//                         </div>
//                       )
//                     : appointment[header.key]}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   </div>
// );
// }

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
        const res = await apiCall(
          "GET",
          `/doctor/${user.doctorId}/appointments`
        );
        setAppointments(res?.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDoctorAppointments();
  }, [user, isLoading]);

  const updateStatus = async (id, type) => {
    try {
      const url =
        type === "approve"
          ? `/appointments/${id}/approve`
          : `/appointments/${id}/reject`;

      const res = await apiCall("PATCH", url);
      alert(res?.data.message);

      // Update UI instantly
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === id
            ? {
                ...appointment,
                status: type === "approve" ? "approved" : "rejected",
              }
            : appointment
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
            {appointments.map((appointment) => {
              const isPending =
                String(appointment?.status).toLowerCase() === "pending";
              const isApproved = appointment?.status === "approved";

              return (
                <tr key={appointment?.id}>
                  <td>{appointment?.id}</td>
                  <td>{appointment?.patient_name}</td>
                  <td>{appointment?.date}</td>
                  <td>
                    {appointment?.start_time} – {appointment?.end_time}
                  </td>

                  <td>
                    {!isPending ? (
                      <strong style={{ color: isApproved ? "green" : "red" }}>
                        {appointment?.status}
                      </strong>
                    ) : (
                      "Pending"
                    )}
                  </td>

                  <td>
                    {isPending ? (
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
                      <em style={{ color: "#777" }}>No Action</em>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
