import React, { useState, useEffect } from "react";

function App() {
  const API = "https://reminder-app-l9oj.onrender.com/reminders";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [intervalDays, setIntervalDays] = useState("");
  const [reminders, setReminders] = useState([]);
  const [editingId, setEditingId] = useState(null); // 🔥 EDIT STATE

  const fetchReminders = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setReminders(data);
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  // 🔥 EDIT HANDLER (prefill form)
  const handleEdit = (r) => {
    setTitle(r.title);
    setDescription(r.description);
    setTime(r.reminderTime?.slice(0, 16)); // format for datetime-local
    setIntervalDays(r.intervalDays || "");
    setEditingId(r.id);
  };

  // 🔥 ADD / UPDATE
  const handleSubmit = async () => {
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

    if (editingId) {
      // UPDATE
      await fetch(`${API}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reminder)
      });
      setEditingId(null);
      alert("Reminder updated!");
    } else {
      // CREATE
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reminder)
      });
      alert("Reminder added!");
    }

    // reset
    setTitle("");
    setDescription("");
    setTime("");
    setIntervalDays("");

    fetchReminders();
  };

  // DELETE
  const deleteReminder = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchReminders();
  };

  // 🔥 MARK DONE
  const markDone = async (id) => {
    await fetch(`${API}/done/${id}`, { method: "PUT" });
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

      <input
        type="number"
        placeholder="Repeat every X days (optional)"
        value={intervalDays}
        onChange={(e) => setIntervalDays(e.target.value)}
      />
      <br /><br />

      <button onClick={handleSubmit}>
        {editingId ? "Update Reminder" : "Add Reminder"}
      </button>

      <h2>All Reminders</h2>

      {reminders.map((r) => (
        <div key={r.id}>
          <p><b>{r.title}</b></p>
          <p>{r.description}</p>
          <p>{r.reminderTime}</p>
          <p>
            Repeat: {r.intervalDays ? `${r.intervalDays} day(s)` : "One-time"}
          </p>
          <p>Status: {r.status}</p>

          {/* 🔥 ACTION BUTTONS */}
          <button onClick={() => handleEdit(r)}>Edit</button>
          <button onClick={() => markDone(r.id)}>Done</button>
          <button onClick={() => deleteReminder(r.id)}>Delete</button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;