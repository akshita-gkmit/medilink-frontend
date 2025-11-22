const DoctorList = ({ doctors, onSelectDoctor }) => {
  return (
    <div className="stats-grid">
      {doctors.map((doc) => (
        <div key={doc.id} className="stat-card">
          <h3>Dr. {doc.name}</h3>
          <p>{doc.specialization}</p>
          <small>{doc.qualification}</small>

          <button
            className="btn-primary"
            onClick={() => onSelectDoctor(doc)}   // ✔ sending full doctor object
          >
            Book Appointment
          </button>
        </div>
      ))}
    </div>
  );
};

export default DoctorList;
