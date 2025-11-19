// bookAppointment.jsx
import React, { useEffect, useState } from "react";
import { apiCall } from "../../services/apiHelper";
import API from "../../constants/apiEndpoints";
import { useAuth } from "../../context/authContext";

export default function BookAppointment({ doctor, close, refreshAppointments }) {
  const { user } = useAuth();

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState(null);

  const doctorId = doctor?.id;

  useEffect(() => {
    if (doctorId) loadSlots(date);
  }, [doctorId]);

  /** Load available slots */
  async function loadSlots(dateToLoad) {
    setLoadingSlots(true);
    setError(null);
    setSelectedSlotId(null);

    try {
      const res = await apiCall(
        "GET",
        `/patient/doctor/${doctorId}/slots?date=${dateToLoad}`
      );

      setSlots(res.data || []);
    } catch (err) {
      console.error("Failed to load slots:", err);
      setError("Failed to load slots");
    } finally {
      setLoadingSlots(false);
    }
  }

  /** Book appointment */
  const confirmBooking = async () => {
    if (!selectedSlotId) return;

    setBooking(true);

    try {
      const payload = {
        patient_id: user.patientId,
        doctor_id: doctorId,
        slot_id: selectedSlotId,
      };

      await apiCall("POST", API.PATIENT_BOOK_APPOINTMENT, payload);

      refreshAppointments();
      close();

    } catch (err) {
      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(detail[0].msg);
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Booking failed");
      }

    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Book Appointment with Dr. {doctor.name}</h2>

        {/* DATE PICKER */}
        <div className="slot-controls">
          <input
            type="date"
            name="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button className="btn" onClick={() => loadSlots(date)}>
            Load Slots
          </button>
        </div>

        {/* SLOT LIST */}
        <div className="slots-container">
          {loadingSlots && <div className="loading">Loading slots...</div>}

          {!loadingSlots &&
            slots.map((slot) => {
              const label = `${slot.start_time} - ${slot.end_time}`;
              const isSelected = selectedSlotId === slot.slot_id;
              const isAvailable = !slot.status || slot.status.toLowerCase() === "available";

              return (
                <button
                  key={slot.slot_id}
                  className={`slot-pill ${isSelected ? "selected" : ""} ${
                    isAvailable ? "available" : "booked"
                  }`}
                  disabled={!isAvailable}
                  onClick={() => setSelectedSlotId(slot.slot_id)}
                >
                  {label}
                </button>
              );
            })}
        </div>

        {/* FOOTER */}
        <div className="slot-actions">
          {error && <p className="error">{String(error)}</p>}

          <button
            className="btn btn-confirm"
            onClick={confirmBooking}
            disabled={!selectedSlotId || booking}
          >
            {booking ? "Booking..." : "Confirm Booking"}
          </button>

          <button className="btn btn-secondary" onClick={close}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
