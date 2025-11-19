import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { apiCall } from "../services/apiHelper";
import { useAuth } from "../context/authContext"; 

const ViewDoctor = () => {
  const { id } = useParams();
  const { user } = useAuth(); 
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDoctor();
  }, []);

  const fetchDoctor = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const res = await apiCall("GET", `/doctor/${id}`, null, {
      Authorization: `Bearer ${token}`,
    });
    setDoctor(res.data);
  } catch (err) {
    setError("Failed to load doctor");
  } finally {
    setLoading(false);
  }
};

  if (loading) return <div>Loading doctor...</div>;
  if (error) return <div>{error}</div>;

  const isAdmin = user?.role === "admin";

  return (
    <div className="view-doctor-container">
      <h1>Doctor Details</h1>

      <div className="doctor-card">
        <p><strong>Name:</strong> {doctor.name}</p>
        <p><strong>Specialization:</strong> {doctor.specialization}</p>
        <p><strong>Chamber:</strong> {doctor.chamber}</p>

        {isAdmin && (
          <>
            <p><strong>Email:</strong> {doctor.email}</p>
            <p><strong>Status:</strong> {doctor.status ? "Active" : "Inactive"}</p>
            <p><strong>Qualification:</strong> {doctor.qualification}</p>
            <p><strong>Position:</strong> {doctor.position}</p>
            <p><strong>Created At:</strong> {doctor.created_at}</p>
            <p><strong>Updated At:</strong> {doctor.updated_at}</p>

            {doctor.deleted_at && (
              <p style={{ color: "red" }}>
                <strong>Deleted At:</strong> {doctor.deleted_at}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewDoctor;