import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { apiCall } from "../../services/apiHelper";
import API from "../../constants/apiEndpoints";
import { useAuth } from "../../context/authContext";
import "../../index.css";

const generateTimeSlots = () => {
  const slots = [];
  let start = 10 * 60; // 10:00
  let end = 19 * 60;   // 19:00

  while (start < end) {
    const hours = String(Math.floor(start / 60)).padStart(2, "0");
    const minutes = String(start % 60).padStart(2, "0");
    slots.push(`${hours}:${minutes}`);
    start += 30;
  }
  return slots;
};

const ManageSlots = () => {
  const { user } = useAuth();
  const doctorId = user?.doctor_id;        // Correct doctor ID
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);

  const [existingSlots, setExistingSlots] = useState([]);   // already booked
  const [selectedSlots, setSelectedSlots] = useState([]);   // user selecting
  const [message, setMessage] = useState("");

  const allSlots = generateTimeSlots();

  const fetchExistingSlots = async () => {
    if (!doctorId || !date) return;

    try {
      const res = await apiCall(
        "get",
        `/doctor/slots?doctor_id=${doctorId}&date=${date}`
      );

      // Backend must return array of objects
      // Example: [{ start_time: "10:00", end_time: "10:30", status: "Booked" }]
      const slotTimes = res?.data?.slots?.map((s) => s.start_time) || [];

      setExistingSlots(slotTimes);
    } catch (error) {
      console.error("Failed to load slots:", error);
      setExistingSlots([]);
    }
  };

  useEffect(() => {
    fetchExistingSlots();
  }, [doctorId, date]);

  const toggleSlot = (time) => {
    if (selectedSlots.includes(time)) {
      setSelectedSlots(selectedSlots.filter((t) => t !== time));
    } else {
      setSelectedSlots([...selectedSlots, time]);
    }
  };

  const handleSave = async () => {
  if (!date || selectedSlots.length === 0) {
    setMessage("Please select a date and at least one slot.");
    return;
  }

  try {
    const payload = {
      doctor_id: user.doctorId,  
      date: date,
      slots: selectedSlots,
    };

    console.log("PAYLOAD:", JSON.stringify(payload, null, 2));

    await apiCall("post", API.CREATE_DOCTOR_SLOTS, payload);

    setMessage("Slots saved successfully!");
    setSelectedSlots([]);
    fetchExistingSlots();
  } catch (error) {
    console.error(error);
    setMessage("Failed to save slots.");
  }
};

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: "650px" }}>
        <h1>Manage Appointment Slots</h1>

        {message && <div className="error-message">{message}</div>}

        {/* DATE PICKER */}
        <div className="form-group">
          <label>Select Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setMessage("");
            }}
          />
        </div>

        {/* SLOT GRID */}
        {date && (
          <>
            <h3 style={{ marginTop: "1.5rem" }}>Available Time Slots</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: "12px",
                marginTop: "1rem",
              }}
            >
              {allSlots.map((time) => {
                const isUsed = existingSlots.includes(time);
                const isSelected = selectedSlots.includes(time);

                return (
                  <label
                    key={time}
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      background: isUsed
                        ? "#dcdcdc"
                        : isSelected
                        ? "var(--primary)"
                        : "#fff",
                      color: isUsed
                        ? "#444"
                        : isSelected
                        ? "#fff"
                        : "#333",
                      cursor: isUsed ? "not-allowed" : "pointer",
                      opacity: isUsed ? 0.6 : 1,
                      textAlign: "center",
                      fontWeight: "500",
                    }}
                  >
                    <input
                      type="checkbox"
                      disabled={isUsed}
                      checked={isSelected}
                      onChange={() => toggleSlot(time)}
                      style={{ display: "none" }}
                    />
                    {time}
                  </label>
                );
              })}
            </div>

            <button
              className="btn-primary"
              onClick={handleSave}
              style={{ marginTop: "1.5rem" }}
            >
              Save Slots
            </button>

            <button
              className="btn-secondary"
              style={{ marginTop: "1rem", width: "100%" }}
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ManageSlots;
