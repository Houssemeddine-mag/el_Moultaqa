import { useState, useEffect } from "react";
import backend from "../backend.js";

export default function EventManagerPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    short_name: "",
    start_date: "",
    end_date: "",
    location: "",
    venue: "",
  });

  // Load events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await backend.getEvents();
        setEvents(data || []);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events: " + (err.message || "Unknown error"));
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      if (!formData.title.trim()) {
        alert("Event title is required");
        return;
      }

      setLoading(true);
      const newEvent = await backend.addEvent(formData);
      setEvents((prev) => [...prev, newEvent]);
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        short_name: "",
        start_date: "",
        end_date: "",
        location: "",
        venue: "",
      });
      setShowForm(false);
      alert("Event created successfully!");
    } catch (err) {
      console.error("Error creating event:", err);
      alert("Failed to create event: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      setLoading(true);
      await backend.deleteEvent(eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      alert("Event deleted successfully!");
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h1>Events</h1>
          <p className="subtitle">Create and manage conference events</p>
        </div>
        <button
          className="landing-cta"
          onClick={() => setShowForm(!showForm)}
          style={{ background: "var(--accent)" }}
        >
          {showForm ? "Cancel" : "+ New Event"}
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: "12px",
            marginBottom: "16px",
            backgroundColor: "#fee",
            color: "#c33",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}

      {showForm && (
        <div className="page-card" style={{ marginBottom: "24px", background: "var(--surface-strong)" }}>
          <h2>Create New Event</h2>
          <form onSubmit={handleAddEvent} style={{ display: "grid", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label>Event Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., El Moultaqa 2024"
                  required
                />
              </div>
              <div>
                <label>Short Name</label>
                <input
                  type="text"
                  name="short_name"
                  value={formData.short_name}
                  onChange={handleInputChange}
                  placeholder="e.g., EM2024"
                />
              </div>
            </div>

            <div>
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Event description..."
                rows={3}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label>Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Algiers, Algeria"
                />
              </div>
              <div>
                <label>Venue</label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  placeholder="e.g., International Conference Center"
                />
              </div>
            </div>

            <button
              type="submit"
              className="landing-cta"
              disabled={loading}
              style={{ background: "var(--accent)" }}
            >
              {loading ? "Creating..." : "Create Event"}
            </button>
          </form>
        </div>
      )}

      <div className="grid-cards">
        {loading && events.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px" }}>
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px" }}>
            <p style={{ color: "#666" }}>No events yet. Create one to get started!</p>
          </div>
        ) : (
          events.map((event) => (
            <div className="card-block" key={event.id} style={{ position: "relative" }}>
              <h3>{event.title}</h3>
              {event.short_name && <p>Short Name: <strong>{event.short_name}</strong></p>}
              {event.description && (
                <p style={{ color: "#666", fontSize: "0.9em" }}>
                  {event.description.length > 100
                    ? event.description.substring(0, 100) + "..."
                    : event.description}
                </p>
              )}
              {event.start_date && (
                <p style={{ fontSize: "0.9em", color: "#999" }}>
                  📅 {new Date(event.start_date).toLocaleDateString()}
                  {event.end_date && event.end_date !== event.start_date
                    ? ` - ${new Date(event.end_date).toLocaleDateString()}`
                    : ""}
                </p>
              )}
              {event.location && (
                <p style={{ fontSize: "0.9em", color: "#999" }}>📍 {event.location}</p>
              )}
              <p style={{ marginTop: "8px" }}>
                Status:{" "}
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: "3px",
                    fontSize: "0.85em",
                    backgroundColor: event.status === "published" ? "#e8f4e8" : "#f0f0f0",
                    color: event.status === "published" ? "#0a6a0a" : "#333",
                  }}
                >
                  {event.status || "draft"}
                </span>
              </p>
              <button
                onClick={() => handleDeleteEvent(event.id)}
                style={{
                  marginTop: "12px",
                  padding: "6px 12px",
                  background: "#fee",
                  color: "#c33",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.85em",
                }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
