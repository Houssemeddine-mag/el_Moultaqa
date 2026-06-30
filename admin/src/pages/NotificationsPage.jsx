import { useState, useEffect } from "react";
import { Pin } from "lucide-react";
import backend from "../backend.js";
import ExportButton from "../Components/ExportButton.jsx";

// Notification type badge colours
const TYPE_COLOURS = {
  info: { bg: "rgba(14, 165, 233, 0.12)", text: "#0ea5e9", label: "Info" },
  warning: { bg: "rgba(245, 158, 11, 0.12)", text: "#f59e0b", label: "Warning" },
  urgent: { bg: "rgba(239, 68, 68, 0.12)", text: "#ef4444", label: "Urgent" },
  session: { bg: "rgba(13, 126, 82, 0.12)", text: "#0d7e52", label: "Session" },
};

const EMPTY_FORM = { title: "", message: "", type: "info", isPinned: false };

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    fetchNotifs();
  }, []);

  async function fetchNotifs() {
    try {
      setLoading(true);
      setError("");
      const data = await backend.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error("[NotificationsPage] load error:", err);
      setError("Failed to load notifications: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      alert("Title and message are required.");
      return;
    }
    try {
      setSaving(true);
      const created = await backend.addNotification(form);
      setNotifications((prev) => [created, ...prev]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (err) {
      console.error("[NotificationsPage] send error:", err);
      alert("Failed to send notification: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this notification? Attendees will no longer see it.")) return;
    try {
      await backend.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      alert("Failed to delete: " + (err.message || "Unknown error"));
    }
  }

  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p className="subtitle">Broadcast announcements to all attendees in real time.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <ExportButton
            data={notifications.map((n) => ({
              Title: n.title,
              Message: n.message,
              Type: n.type,
              "Is Pinned": n.isPinned ? "Yes" : "No",
              "Created At": n.createdAt ? new Date(n.createdAt).toLocaleString() : "",
            }))}
            filename="notifications"
          />
          <button
            className="landing-cta"
            onClick={() => setShowForm((v) => !v)}
            style={{ background: "var(--accent)" }}
          >
            {showForm ? "Cancel" : "＋ New Notification"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: "12px", marginBottom: 16, background: "#fee", color: "#c33", borderRadius: 8, border: "1px solid rgba(239,68,68,.2)" }}>
          {error}
        </div>
      )}

      {/* Compose form */}
      {showForm && (
        <div className="page-card" style={{ marginBottom: 24, background: "var(--surface-strong)" }}>
          <h2 style={{ marginBottom: 16 }}>Send Notification</h2>
          <form onSubmit={handleSend} style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={{ display: "block", marginBottom: 6, fontSize: ".88rem", fontWeight: 600 }}>Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Session change in Room A"
                  required
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 6, fontSize: ".88rem", fontWeight: 600 }}>Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)" }}
                >
                  {Object.entries(TYPE_COLOURS).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: ".88rem", fontWeight: 600 }}>Message *</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                rows={3}
                placeholder="Write the notification body..."
                required
              />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none", fontSize: ".9rem" }}>
              <input
                type="checkbox"
                checked={form.isPinned}
                onChange={(e) => setForm((f) => ({ ...f, isPinned: e.target.checked }))}
              />
              Pin at top for attendees
            </label>
            <button
              type="submit"
              className="landing-cta"
              disabled={saving}
              style={{ background: "var(--accent)", justifySelf: "start", padding: "10px 28px" }}
            >
              {saving ? "Sending…" : "Send Notification"}
            </button>
          </form>
        </div>
      )}

      {/* Notification list */}
      {loading ? (
        <div style={{ padding: "40px", textAlign: "center" }}>Loading notifications…</div>
      ) : notifications.length === 0 ? (
        <div className="empty-state">
          <h3>No notifications yet</h3>
          <p className="subtitle">Create one above to broadcast an announcement to all attendees.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {notifications.map((n) => {
            const colours = TYPE_COLOURS[n.type] || TYPE_COLOURS.info;
            return (
              <div
                key={n.id}
                style={{
                  padding: "16px 20px",
                  borderRadius: 12,
                  border: `1px solid ${colours.bg}`,
                  background: colours.bg,
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 12,
                  alignItems: "start",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    {n.isPinned && (
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, background: "rgba(255,255,255,.15)", padding: "2px 8px", borderRadius: 4, color: "var(--text)" }}>
                        <Pin size={14} style={{ verticalAlign: "middle", marginRight: 4 }} /> Pinned
                      </span>
                    )}
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: colours.text, background: colours.bg, padding: "2px 10px", borderRadius: 20, border: `1px solid ${colours.text}40` }}>
                      {colours.label}
                    </span>
                  </div>
                  <h3 style={{ margin: "0 0 4px", fontSize: "1rem" }}>{n.title}</h3>
                  <p style={{ margin: 0, fontSize: ".9rem", opacity: .85 }}>{n.message}</p>
                  <p style={{ margin: "6px 0 0", fontSize: ".78rem", opacity: .5 }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(n.id)}
                  style={{
                    padding: "6px 14px", background: "rgba(239,68,68,.1)", color: "#ef4444",
                    border: "1px solid rgba(239,68,68,.2)", borderRadius: 8, cursor: "pointer",
                    fontSize: ".83rem", fontWeight: 600, whiteSpace: "nowrap",
                  }}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
