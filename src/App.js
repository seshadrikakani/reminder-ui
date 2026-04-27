import React, { useState, useEffect } from "react";

function App() {

  const API = "https://reminder-app-l9oj.onrender.com/reminders";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [intervalDays, setIntervalDays] = useState("");
  const [reminders, setReminders] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // 🎨 Styles
  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  };

  const mainButton = {
    width: "100%",
    padding: "10px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  };

  const cardStyle = {
    background: "white",
    width: "350px",
    margin: "15px auto",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0px 0px 8px rgba(0,0,0,0.1)"
  };

  const editBtn = {
    marginRight: "5px",
    background: "#ffc107",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer"
  };

  const doneBtn = {
    marginRight: "5px",
    background: "green",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer"
  };

  const deleteBtn = {
    background: "red",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer"
  };

  // 🔥 Fetch reminders
  const fetchReminders = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setReminders(data);
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  // 🔥 Edit handler
  const handleEdit = (r) => {
    setTitle(r.title);
    setDescription(r.description);
    setTime(r.reminderTime?.slice(0, 16));
    setIntervalDays(r.intervalDays || "");
    setEditingId(r.id);
  };

  // 🔥 Add / Update
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

    // Reset form
    setTitle("");
    setDescription("");
    setTime("");
    setIntervalDays("");

    fetchReminders();
  };

  // ❌ Delete
  const deleteReminder = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchReminders();
  };

  // ✅ Mark Done
  const markDone = async (id) => {
    await fetch(`${API}/done/${id}`, { method: "PUT" });
    fetchReminders();
  };

  return (
    <div style={{
      fontFamily: "Arial",
      background: "#f4f6f8",
      minHeight: "100vh",
      padding: "30px"
    }}>

      <h1 style={{ textAlign: "center" }}>🔔 Reminder App</h1>

      {/* FORM */}
      <div style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        width: "350px",
        margin: "20px auto",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)"
      }}>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={inputStyle}
        />

        <input
          type="datetime-local"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="Repeat every X days (optional)"
          value={intervalDays}
          onChange={(e) => setIntervalDays(e.target.value)}
          style={inputStyle}
        />

        <button onClick={handleSubmit} style={mainButton}>
          {editingId ? "Update Reminder" : "Add Reminder"}
        </button>
      </div>

      {/* LIST */}
      <h2 style={{ textAlign: "center" }}>📋 All Reminders</h2>

      {reminders.map((r) => (
        <div key={r.id} style={cardStyle}>

          <h3>{r.title}</h3>
          <p>{r.description}</p>

          <p><b>Time:</b> {r.reminderTime}</p>

          <p>
            <b>Repeat:</b>{" "}
            {r.intervalDays
              ? r.intervalDays === 1
                ? "Daily"
                : `${r.intervalDays} days`
              : "One-time"}
          </p>

          <p>
            <b>Status:</b>{" "}
            <span style={{
              color: r.status === "DONE" ? "green" : "orange",
              fontWeight: "bold"
            }}>
              {r.status}
            </span>
          </p>

          <div style={{ marginTop: "10px" }}>
            <button style={editBtn} onClick={() => handleEdit(r)}>Edit</button>
            <button style={doneBtn} onClick={() => markDone(r.id)}>Done</button>
            <button style={deleteBtn} onClick={() => deleteReminder(r.id)}>Delete</button>
          </div>

        </div>
      ))}

    </div>
  );
}

export default App;