import { useState, useEffect } from "react";
import axios from "axios";

const DoctorSlotManager = ({ doctorId }) => {
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);

  // Fetch generated slots for selected date
  const generateSlots = async () => {
    if (!date) return;
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/doctor/slots/generate`,
      { params: { doctor_id: doctorId, date } }
    );
    setSlots(res.data.slots);
  };

  const handleCheckbox = (slot) => {
    const key = `${slot.start_time}-${slot.end_time}`;

    setSelectedSlots((prev) =>
      prev.some((s) => `${s.start_time}-${s.end_time}` === key)
        ? prev.filter((s) => `${s.start_time}-${s.end_time}` !== key) // remove
        : [...prev, slot] // add
    );
  };

  const saveSlots = async () => {
    await axios.post(`${import.meta.env.VITE_BASE_URL}/doctor/slots/save`, {
      doctor_id: doctorId,
      date,
      selected_slots: selectedSlots,
    });

    alert("Slots saved successfully");
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Manage Your Slots</h1>

      {/* Date Picker */}
      <input
        type="date"
        className="border px-3 py-2 rounded"
        value={date}
        min={new Date().toISOString().split("T")[0]}                          // today
        max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]} // +7 days
        onChange={(e) => setDate(e.target.value)}
        />


      {/* Slots Checkboxes */}
      <div className="grid grid-cols-3 gap-3">
        {slots.map((slot, index) => (
          <label key={index} className="flex items-center gap-2 p-2 border rounded">
            <input
              type="checkbox"
              onChange={() => handleCheckbox(slot)}
            />
            {slot.start_time} - {slot.end_time}
          </label>
        ))}
      </div>

      <button
        onClick={saveSlots}
        className="mt-5 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Slots
      </button>
    </div>
  );
};

export default DoctorSlotManager;
