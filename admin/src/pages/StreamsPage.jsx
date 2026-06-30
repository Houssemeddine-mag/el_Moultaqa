import { useState, useEffect } from "react";
import { Video, Plus, Trash2, ExternalLink, Tv, AlertCircle } from "lucide-react";
import backend from "../backend.js";
import ExportButton from "../Components/ExportButton.jsx";

const EMPTY_FORM = { name: "", url: "" };

export default function StreamsPage() {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    fetchStreams();
  }, []);

  async function fetchStreams() {
    try {
      setLoading(true);
      setError("");
      const data = await backend.getStreams();
      setStreams(data || []);
    } catch (err) {
      console.error("[StreamsPage] load error:", err);
      setError("Failed to load streams: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.url.trim()) {
      alert("Name and URL are required.");
      return;
    }
    try {
      setSaving(true);
      const created = await backend.addStream({
        name: form.name.trim(),
        url: form.url.trim(),
      });
      setStreams((prev) => [created, ...prev]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (err) {
      console.error("[StreamsPage] add error:", err);
      alert("Failed to add stream: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this stream? Attendees will no longer see it.")) return;
    try {
      await backend.deleteStream(id);
      setStreams((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert("Failed to delete: " + (err.message || "Unknown error"));
    }
  }

  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h1>Live Streams</h1>
          <p className="subtitle">
            Manage live streams for your conference. Attendees can watch directly
            from the mobile app and webapp.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <ExportButton
            data={streams.map((s) => ({
              Name: s.name,
              URL: s.url,
            }))}
            filename="streams"
          />
          <button
            className="primary-button"
            onClick={() => setShowForm((v) => !v)}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <Plus size={18} />
            {showForm ? "Cancel" : "Add Stream"}
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: 16,
            background: "rgba(239,68,68,.08)",
            color: "#ef4444",
            borderRadius: 10,
            border: "1px solid rgba(239,68,68,.15)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: ".9rem",
          }}
        >
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {showForm && (
        <div
          className="page-card"
          style={{
            marginBottom: 24,
            background: "var(--surface-strong)",
            border: "1px solid var(--accent)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Video size={20} color="#fff" />
            </div>
            <h2 style={{ margin: 0, fontSize: "1.1rem" }}>New Live Stream</h2>
          </div>
          <form onSubmit={handleAdd} className="settings-form" style={{ display: "grid", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <label>
                Stream Name *
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="e.g. Main Stage, Workshop Room B"
                  required
                />
              </label>
              <label>
                YouTube URL *
                <input
                  type="url"
                  value={form.url}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, url: e.target.value }))
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
              </label>
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
                paddingTop: 8,
              }}
            >
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="primary-button"
                disabled={saving}
                style={{ opacity: saving ? 0.6 : 1 }}
              >
                {saving ? "Adding…" : "Add Stream"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ padding: "60px", textAlign: "center", color: "var(--text-muted)" }}>
          Loading streams…
        </div>
      ) : streams.length === 0 ? (
        <div className="empty-state" style={{ padding: "60px 20px" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "var(--accent)",
              opacity: 0.12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Tv size={32} style={{ color: "var(--accent)", opacity: 0.6 }} />
          </div>
          <h3>No live streams yet</h3>
          <p className="subtitle">
            Add your first stream above to let attendees watch live from the app.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {streams.map((s) => {
            return (
              <div
                key={s.id}
                className="page-card"
                style={{
                  padding: "16px 20px",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: 16,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: "var(--accent)",
                    opacity: 0.1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Video size={22} style={{ color: "var(--accent)" }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 4,
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "1rem",
                        fontWeight: 600,
                      }}
                    >
                      {s.name}
                    </h3>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: ".72rem",
                        fontWeight: 700,
                        color: "#dc2626",
                        background: "rgba(220,38,38,.1)",
                        padding: "2px 8px",
                        borderRadius: 20,
                        textTransform: "uppercase",
                        letterSpacing: ".03em",
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "#dc2626",
                          display: "inline-block",
                        }}
                      />
                      Live
                    </span>
                  </div>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      margin: 0,
                      fontSize: ".83rem",
                      color: "var(--text-muted)",
                      wordBreak: "break-all",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      transition: "color .15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--text-muted)";
                    }}
                  >
                    {s.url}
                    <ExternalLink size={13} />
                  </a>
                </div>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="danger-button"
                  title="Delete stream"
                >
                  <Trash2 size={15} style={{ verticalAlign: "middle", marginRight: 4 }} />
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
