import "../../index.css";

const HistoryList = ({ history, close }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box large-modal">
        <h2>Appointment History</h2>

        <table className="history-table">
          <thead>
            <tr>
              <th>Doctor Name</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {history?.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "15px" }}>
                  No past appointments found.
                </td>
              </tr>
            ) : (history.map((item) => (
                <tr key={item.id}>
                  <td>{item.doctor_name}</td>
                  <td>{item.date}</td>
                  <td>{item.start_time}</td>
                  <td>{item.end_time}</td>
                  <td>
                    <span className={`status-${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={close}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryList;