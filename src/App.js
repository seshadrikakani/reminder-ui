import React, { useState, useEffect } from "react";

function App() {

  const API = "https://reminder-app-l9oj.onrender.com/reminders";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [intervalDays, setIntervalDays] = useState(""); // 🔥 NEW
  const [reminders, setReminders] = useState([]);

  const fetchReminders = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setReminders(data);
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleSubmit = async () => {

    // ✅ Validation
    if (!title || !description || !time) {
      alert("Please fill all required fields");
      return;
    }

    const reminder = {
      title,
      description,
      reminderTime: time,
      intervalDays: intervalDays ? parseInt(intervalDays) : null
    };

    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reminder)
    });

    alert("Reminder added!");

    // reset fields
    setTitle("");
    setDescription("");
    setTime("");
    setIntervalDays("");

    fetchReminders();
  };

  const deleteReminder = async (id) => {
    await fetch(`${API}/${id}`, {
      method: "DELETE"
    });
    fetchReminders();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Reminder App 🔔</h1>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br /><br />

      <input
        type="datetime-local"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <br /><br />

      {/* 🔥 NEW INPUT */}
      <input
        type="number"
        placeholder="Repeat every X days (optional)"
        value={intervalDays}
        onChange={(e) => setIntervalDays(e.target.value)}
      />
      <br /><br />

      <button onClick={handleSubmit}>
        Add Reminder
      </button>

      <h2>All Reminders</h2>

      {reminders.map((r) => (
        <div key={r.id}>
          <p><b>{r.title}</b></p>
          <p>{r.description}</p>
          <p>{r.reminderTime}</p>
          <p>Repeat: {r.intervalDays ? `${r.intervalDays} day(s)` : "One-time"}</p>

          <button onClick={() => deleteReminder(r.id)}>
            Delete
          </button>

          <hr />
        </div>
      ))}

    </div>
  );
}

export default App;