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
    minHeight: "100vh",
    padding: "20px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "white"
  };

  const formCard = {
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(12px)",
    padding: "20px",
    borderRadius: "16px",
    width: "350px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    background: "rgba(255,255,255,0.3)",
    color: "white"
  };

  const buttonPrimary = {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg, #00c6ff, #0072ff)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s"
  };

  const cardStyle = {
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    width: "350px",
    margin: "15px auto",
    padding: "15px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
  };

  const actionBtn = {
    marginRight: "5px",
    padding: "6px 10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  };

  const filterBtn = (active) => ({
    margin: "5px",
    padding: "8px 14px",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
    background: active ? "#00c6ff" : "rgba(255,255,255,0.3)",
    color: "white",
    fontWeight: "bold"
  });

  // 🔥 Fetch
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
    const confirmDelete = window.confirm("Delete this reminder?");
    if (!confirmDelete) return;

    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchReminders();
  };

  // ✅ Done
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

      {/* 🖼️ Top Image */}
      <img
        src="https://cdn-icons-png.flaticon.com/512/3176/3176363.png"
        alt="reminder"
        style={{ width: "80px" }}
      />

      <h1>Smart Reminder</h1>

      {editingId && <p>✏️ Editing Reminder...</p>}

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
          placeholder="Repeat every X days"
          value={intervalDays}
          onChange={(e) => setIntervalDays(e.target.value)}
          style={inputStyle}
        />

        <button onClick={handleSubmit} style={buttonPrimary}>
          {editingId ? "Update Reminder" : "Add Reminder"}
        </button>
      </div>

      {/* FILTERS */}
      <div>
        <button style={filterBtn(filter === "ALL")} onClick={() => setFilter("ALL")}>All</button>
        <button style={filterBtn(filter === "PENDING")} onClick={() => setFilter("PENDING")}>Pending</button>
        <button style={filterBtn(filter === "DONE")} onClick={() => setFilter("DONE")}>Done</button>
      </div>

      <h2>📋 All Reminders</h2>

      {loading && <p>Loading...</p>}

      {/* LIST */}
      {filteredReminders.map((r) => (
        <div
          key={r.id}
          style={{
            ...cardStyle,
            opacity: r.status === "DONE" ? 0.6 : 1
          }}
        >

          <h3>{r.title}</h3>
          <p>{r.description}</p>

          <p>
            {new Date(r.reminderTime).toLocaleString()}
          </p>

          <p>
            {r.intervalDays
              ? `Repeat every ${r.intervalDays} days`
              : "One-time"}
          </p>

          <p>
            <b>Status:</b> {r.status}
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