import { useState, useEffect } from "react";
import { Calendar, MapPin, Building2, X, Check, Edit3 } from "lucide-react";
import backend from "../backend.js";

const EMPTY_FORM = {
  title: "",
  description: "",
  short_name: "",
  start_date: "",
  end_date: "",
  location: "",
  venue: "",
};

export default function EventManagerPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // null = create mode, object = edit mode
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      setLoading(true);
      setError("");
      const data = await backend.getEvents();
      setEvents(data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }

  function openCreateForm() {
    setEditingEvent(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
  }

  function openEditForm(event) {
    setEditingEvent(event);
    setFormData({
      title: event.title || "",
      description: event.description || "",
      short_name: event.short_name || "",
      start_date: event.start_date ? event.start_date.slice(0, 10) : "",
      end_date: event.end_date ? event.end_date.slice(0, 10) : "",
      location: event.location || "",
      venue: event.venue || "",
    });
    setShowForm(true);
  }

  function closeForm() {
    setEditingEvent(null);
    setFormData(EMPTY_FORM);
    setShowForm(false);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Event title is required.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      if (editingEvent) {
        // --- EDIT ---
        const updated = await backend.updateEvent(editingEvent.id, formData);
        setEvents((prev) =>
          prev.map((ev) => (ev.id === editingEvent.id ? { ...ev, ...updated } : ev))
        );
        setSuccess(`"${updated.title}" updated successfully.`);
      } else {
        // --- CREATE ---
        const newEvent = await backend.addEvent(formData);
        setEvents((prev) => [...prev, newEvent]);
        setSuccess(`"${newEvent.title}" created successfully.`);
      }
      closeForm();
    } catch (err) {
      console.error("Error saving event:", err);
      setError("Failed to save event: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteEvent(eventId, title) {
    if (!confirm(`Delete event "${title}"? This will also remove all sessions linked to it.`)) return;
    try {
      setLoading(true);
      await backend.deleteEvent(eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      setSuccess("Event deleted.");
    } catch (err) {
      setError("Failed to delete event: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h1>Events</h1>
          <p className="subtitle">Create and manage conference events</p>
        </div>
        <button
          className="landing-cta"
          onClick={showForm ? closeForm : openCreateForm}
          style={{ background: showForm ? "var(--surface-strong)" : "var(--accent)", border: showForm ? "1px solid var(--border)" : "none", color: showForm ? "var(--text)" : "#fff" }}
        >
          {showForm ? <><X size={16} /> Cancel</> : "+ New Event"}
        </button>
      </div>

      {error && (
        <div style={{ padding: "12px", marginBottom: "16px", background: "#fee", color: "#c33", borderRadius: "8px", border: "1px solid rgba(239,68,68,.2)" }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ padding: "12px", marginBottom: "16px", background: "rgba(13,126,82,.08)", color: "#0d7e52", borderRadius: "8px", border: "1px solid rgba(13,126,82,.2)" }}>
          <Check size={16} style={{ verticalAlign: "middle", marginRight: 4 }} /> {success}
        </div>
      )}

      {/* Create / Edit form */}
      {showForm && (
        <div className="page-card" style={{ marginBottom: "24px", background: "var(--surface-strong)" }}>
          <h2>{editingEvent ? `Edit: ${editingEvent.title}` : "Create New Event"}</h2>
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px", marginTop: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label>Event Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., El Moultaqa 2024" required />
              </div>
              <div>
                <label>Short Name</label>
                <input type="text" name="short_name" value={formData.short_name} onChange={handleInputChange} placeholder="e.g., EM2024" />
              </div>
            </div>

            <div>
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Event description..." rows={3} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label>Start Date</label>
                <input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} />
              </div>
              <div>
                <label>End Date</label>
                <input type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label>Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g., Algiers, Algeria" />
              </div>
              <div>
                <label>Venue</label>
                <input type="text" name="venue" value={formData.venue} onChange={handleInputChange} placeholder="e.g., International Conference Center" />
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button type="submit" className="landing-cta" disabled={saving} style={{ background: "var(--accent)" }}>
                {saving ? "Saving…" : editingEvent ? "Save Changes" : "Create Event"}
              </button>
              <button type="button" onClick={closeForm} style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--text)", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid-cards">
        {loading && events.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px" }}>Loading events...</div>
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
                  {event.description.length > 100 ? event.description.substring(0, 100) + "..." : event.description}
                </p>
              )}
              {event.start_date && (
                <p style={{ fontSize: "0.9em", color: "#999" }}>
                  <Calendar size={14} style={{ verticalAlign: "middle", marginRight: 4 }} /> {new Date(event.start_date).toLocaleDateString()}
                  {event.end_date && event.end_date !== event.start_date ? ` - ${new Date(event.end_date).toLocaleDateString()}` : ""}
                </p>
              )}
              {event.location && <p style={{ fontSize: "0.9em", color: "#999" }}><MapPin size={14} style={{ verticalAlign: "middle", marginRight: 4 }} /> {event.location}</p>}
              {event.venue && <p style={{ fontSize: "0.9em", color: "#999" }}><Building2 size={14} style={{ verticalAlign: "middle", marginRight: 4 }} /> {event.venue}</p>}
              <p style={{ marginTop: "8px" }}>
                Status:{" "}
                <span style={{ padding: "2px 8px", borderRadius: "3px", fontSize: "0.85em", backgroundColor: event.status === "published" ? "#e8f4e8" : "#f0f0f0", color: event.status === "published" ? "#0a6a0a" : "#333" }}>
                  {event.status || "draft"}
                </span>
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button
                  onClick={() => openEditForm(event)}
                  style={{ padding: "6px 14px", background: "rgba(13,126,82,.1)", color: "#0d7e52", border: "1px solid rgba(13,126,82,.25)", borderRadius: "6px", cursor: "pointer", fontSize: "0.85em", fontWeight: 600 }}
                >
                  <Edit3 size={14} style={{ verticalAlign: "middle", marginRight: 4 }} /> Edit
                </button>
                <button
                  onClick={() => handleDeleteEvent(event.id, event.title)}
                  style={{ padding: "6px 12px", background: "#fee", color: "#c33", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.85em" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
