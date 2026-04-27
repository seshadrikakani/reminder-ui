import React, { useState, useEffect } from "react";

function App() {

  const API = "https://reminder-app-l9oj.onrender.com/reminders";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [intervalDays, setIntervalDays] = useState("");
  const [reminders, setReminders] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("ALL");

  // 🎨 Styles
  const containerStyle = {
    fontFamily: "Segoe UI, sans-serif",
    background: "#eef2f7",
    minHeight: "100vh",
    padding: "20px"
  };

  const formCard = {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    width: "350px",
    margin: "20px auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none"
  };

  const buttonPrimary = {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg, #4facfe, #00f2fe)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  };

  const cardStyle = {
    background: "#fff",
    width: "350px",
    margin: "15px auto",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    transition: "0.3s"
  };

  const actionBtn = {
    marginRight: "5px",
    padding: "6px 10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  };

  // 🔥 Fetch reminders
  const fetchReminders = async () => {
    setLoading(true);
    const res = await fetch(API);
    const data = await res.json();
    setReminders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  // ✏️ Edit
  const handleEdit = (r) => {
    setTitle(r.title);
    setDescription(r.description);
    setTime(r.reminderTime?.slice(0, 16));
    setIntervalDays(r.intervalDays || "");
    setEditingId(r.id);
  };

  // ➕ Add / Update
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
      await fetch(`${API}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reminder)
      });
      setEditingId(null);
      alert("Reminder updated!");
    } else {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reminder)
      });
      alert("Reminder added!");
    }

    setTitle("");
    setDescription("");
    setTime("");
    setIntervalDays("");

    fetchReminders();
  };

  // ❌ Delete
  const deleteReminder = async (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchReminders();
  };

  // ✅ Mark Done
  const markDone = async (id) => {
    await fetch(`${API}/done/${id}`, { method: "PUT" });
    fetchReminders();
  };

  // 🔍 Filter
  const filteredReminders = reminders.filter((r) => {
    if (filter === "ALL") return true;
    return r.status === filter;
  });

  return (
    <div style={containerStyle}>

      <h1 style={{ textAlign: "center", color: "#333" }}>
        🔔 Smart Reminder
      </h1>

      {/* ✏️ Editing indicator */}
      {editingId && (
        <p style={{ textAlign: "center", color: "orange" }}>
          ✏️ Editing Reminder...
        </p>
      )}

      {/* FORM */}
      <div style={formCard}>

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

        <button onClick={handleSubmit} style={buttonPrimary}>
          {editingId ? "Update Reminder" : "Add Reminder"}
        </button>
      </div>

      {/* FILTERS */}
      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <button onClick={() => setFilter("ALL")}>All</button>
        <button onClick={() => setFilter("PENDING")}>Pending</button>
        <button onClick={() => setFilter("DONE")}>Completed</button>
      </div>

      {/* LIST */}
      <h2 style={{ textAlign: "center" }}>📋 All Reminders</h2>

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

      {filteredReminders.map((r) => (
        <div
          key={r.id}
          style={{
            ...cardStyle,
            opacity: r.status === "DONE" ? 0.6 : 1,
            borderLeft: r.status === "DONE"
              ? "5px solid green"
              : "5px solid orange"
          }}
        >

          <h3>{r.title}</h3>
          <p>{r.description}</p>

          <p>
            <b>Time:</b>{" "}
            {new Date(r.reminderTime).toLocaleString()}
          </p>

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
              padding: "5px 10px",
              borderRadius: "20px",
              background: r.status === "DONE" ? "#d4edda" : "#fff3cd",
              color: r.status === "DONE" ? "green" : "orange",
              fontWeight: "bold",
              fontSize: "12px"
            }}>
              {r.status}
            </span>
          </p>

          <div style={{ marginTop: "10px" }}>
            <button
              style={{ ...actionBtn, background: "#ffc107" }}
              onClick={() => handleEdit(r)}
            >
              Edit
            </button>

            <button
              style={{ ...actionBtn, background: "green", color: "white" }}
              onClick={() => markDone(r.id)}
              disabled={r.status === "DONE"}
            >
              Done
            </button>

            <button
              style={{ ...actionBtn, background: "red", color: "white" }}
              onClick={() => deleteReminder(r.id)}
            >
              Delete
            </button>
          </div>

        </div>
      ))}

    </div>
  );
}

export default App;