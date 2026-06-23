import { useState, useEffect, useCallback } from "react";
import backend from "../backend.js";

const STAT_META = {
  users:         { label: "Users",         icon: "👥", protected: true },
  events:        { label: "Events",        icon: "📅", protected: true },
  sessions:      { label: "Sessions",      icon: "🎙️", protected: false },
  speakers:      { label: "Speakers",      icon: "🌟", protected: false },
  tickets:       { label: "Tickets",       icon: "🎫", protected: true },
  notifications: { label: "Notifications", icon: "🔔", protected: false },
  questions:     { label: "Questions",     icon: "❓", protected: false },
};

export default function DatabaseManagerPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Loading database statistics…");
  const [confirmInput, setConfirmInput] = useState("");

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setStatusMessage("Fetching live database statistics…");
      const data = await backend.getDatabaseStats();
      setStats(data);
      setStatusMessage(
        `Last refreshed at ${new Date().toLocaleTimeString()} — ${
          Object.values(data).reduce((a, b) => a + b, 0)
        } total records across all collections.`
      );
    } catch (err) {
      console.error("[DatabaseManagerPage] error:", err);
      setStatusMessage("Failed to load statistics: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleClearNotifications = async () => {
    if (confirmInput !== "CLEAR_NOTIFICATIONS") {
      setStatusMessage("Type CLEAR_NOTIFICATIONS in the confirmation box to proceed.");
      return;
    }
    try {
      setLoading(true);
      const notifs = await backend.getNotifications();
      await Promise.all(notifs.map((n) => backend.deleteNotification(n.id)));
      setConfirmInput("");
      setStatusMessage(`Deleted ${notifs.length} notification(s) from the database.`);
      await loadStats();
    } catch (err) {
      setStatusMessage("Clear failed: " + err.message);
      setLoading(false);
    }
  };

  const handleClearQuestions = async () => {
    if (confirmInput !== "CLEAR_QUESTIONS") {
      setStatusMessage("Type CLEAR_QUESTIONS in the confirmation box to proceed.");
      return;
    }
    try {
      setLoading(true);
      const qs = await backend.getQuestions();
      await Promise.all(qs.map((q) => backend.deleteQuestion(q.id)));
      setConfirmInput("");
      setStatusMessage(`Deleted ${qs.length} question(s) from the database.`);
      await loadStats();
    } catch (err) {
      setStatusMessage("Clear failed: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="page-card database-page">
      <div className="page-header">
        <div>
          <h1>Database Manager</h1>
          <p className="subtitle">Live row counts from Supabase across all org schema tables.</p>
        </div>
        <button
          type="button"
          className="landing-cta"
          onClick={loadStats}
          disabled={loading}
          style={{ background: "var(--surface-strong)", border: "1px solid var(--border)", color: "var(--text)" }}
        >
          {loading ? "Loading…" : "↻ Refresh Stats"}
        </button>
      </div>

      <div className="status-banner">
        <span>{statusMessage}</span>
      </div>

      {/* Live stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, margin: "24px 0" }}>
        {Object.entries(STAT_META).map(([key, { label, icon, protected: prot }]) => (
          <div
            key={key}
            style={{
              padding: "20px 16px",
              borderRadius: 14,
              background: prot ? "rgba(13,126,82,.06)" : "var(--surface)",
              border: `1px solid ${prot ? "rgba(13,126,82,.2)" : "var(--border)"}`,
              textAlign: "center",
              position: "relative",
            }}
          >
            <div style={{ fontSize: "1.8rem", marginBottom: 6 }}>{icon}</div>
            <div style={{ fontSize: "2rem", fontWeight: 800, lineHeight: 1 }}>
              {loading ? "…" : (stats?.[key] ?? 0)}
            </div>
            <div style={{ fontSize: ".82rem", opacity: .7, marginTop: 6 }}>{label}</div>
            {prot && (
              <div style={{
                position: "absolute", top: 8, right: 8,
                fontSize: ".65rem", fontWeight: 700,
                background: "rgba(13,126,82,.15)", color: "#0d7e52",
                padding: "2px 6px", borderRadius: 4,
              }}>
                Protected
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Danger zone — only clearable collections */}
      <div style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: 6 }}>Danger Zone</h2>
        <p style={{ fontSize: ".85rem", opacity: .65, marginBottom: 16 }}>
          These actions permanently delete records from the database. Protected collections (users, events, tickets) cannot be cleared here.
        </p>

        {/* Confirm input */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, marginBottom: 6 }}>
            Type the confirmation code below to enable dangerous actions:
          </label>
          <input
            type="text"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            placeholder="e.g. CLEAR_NOTIFICATIONS"
            style={{ maxWidth: 360 }}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
          {/* Clear notifications */}
          <div style={{ padding: "18px", borderRadius: 12, border: "1px solid rgba(239,68,68,.2)", background: "rgba(239,68,68,.04)" }}>
            <h3 style={{ margin: "0 0 6px" }}>🔔 Notifications</h3>
            <p style={{ fontSize: ".85rem", opacity: .7, margin: "0 0 12px" }}>
              Delete all {stats?.notifications ?? "?"} notification(s) from the database.
            </p>
            <button
              type="button"
              onClick={handleClearNotifications}
              disabled={loading}
              style={{
                padding: "8px 18px", background: "rgba(239,68,68,.12)", color: "#ef4444",
                border: "1px solid rgba(239,68,68,.25)", borderRadius: 8, cursor: "pointer",
                fontWeight: 700, fontSize: ".85rem",
              }}
            >
              Clear Notifications
            </button>
          </div>

          {/* Clear questions */}
          <div style={{ padding: "18px", borderRadius: 12, border: "1px solid rgba(239,68,68,.2)", background: "rgba(239,68,68,.04)" }}>
            <h3 style={{ margin: "0 0 6px" }}>❓ Questions</h3>
            <p style={{ fontSize: ".85rem", opacity: .7, margin: "0 0 12px" }}>
              Delete all {stats?.questions ?? "?"} attendee question(s) from the database.
            </p>
            <button
              type="button"
              onClick={handleClearQuestions}
              disabled={loading}
              style={{
                padding: "8px 18px", background: "rgba(239,68,68,.12)", color: "#ef4444",
                border: "1px solid rgba(239,68,68,.25)", borderRadius: 8, cursor: "pointer",
                fontWeight: 700, fontSize: ".85rem",
              }}
            >
              Clear Questions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
