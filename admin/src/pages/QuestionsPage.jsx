import { useState, useEffect } from "react";
import backend from "../backend.js";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "unanswered" | "answered"

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    try {
      setLoading(true);
      setError("");
      const data = await backend.getQuestions();
      setQuestions(data || []);
    } catch (err) {
      console.error("[QuestionsPage] load error:", err);
      setError("Failed to load questions: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAnswered(id, current) {
    try {
      await backend.markQuestionAnswered(id, !current);
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, isAnswered: !current } : q))
      );
    } catch (err) {
      alert("Failed to update question: " + (err.message || "Unknown error"));
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this question?")) return;
    try {
      await backend.deleteQuestion(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      alert("Failed to delete: " + (err.message || "Unknown error"));
    }
  }

  const filtered = questions.filter((q) => {
    if (filter === "unanswered") return !q.isAnswered;
    if (filter === "answered") return q.isAnswered;
    return true;
  });

  const unansweredCount = questions.filter((q) => !q.isAnswered).length;

  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h1>Live Questions</h1>
          <p className="subtitle">Questions submitted by attendees during sessions.</p>
        </div>
        <button
          className="landing-cta"
          onClick={fetchQuestions}
          disabled={loading}
          style={{ background: "var(--surface-strong)", border: "1px solid var(--border)", color: "var(--text)" }}
        >
          {loading ? "Loading…" : "↻ Refresh"}
        </button>
      </div>

      {/* Stats strip */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { key: "all",        label: "All",        count: questions.length },
          { key: "unanswered", label: "Unanswered",  count: unansweredCount },
          { key: "answered",   label: "Answered",    count: questions.length - unansweredCount },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              padding: "8px 18px",
              borderRadius: 30,
              border: `1px solid ${filter === key ? "var(--accent)" : "var(--border)"}`,
              background: filter === key ? "rgba(13,126,82,.12)" : "transparent",
              color: filter === key ? "var(--accent)" : "var(--text)",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: ".88rem",
            }}
          >
            {label} <span style={{ opacity: .7 }}>({count})</span>
          </button>
        ))}
      </div>

      {error && (
        <div style={{ padding: "12px", marginBottom: 16, background: "#fee", color: "#c33", borderRadius: 8 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center" }}>Loading questions…</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <h3>{filter === "all" ? "No questions yet" : `No ${filter} questions`}</h3>
          <p className="subtitle">
            {filter === "all"
              ? "Questions submitted by attendees during live sessions will appear here."
              : "Try switching the filter above."}
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {filtered.map((q) => (
            <div
              key={q.id}
              style={{
                padding: "14px 18px",
                borderRadius: 12,
                border: `1px solid ${q.isAnswered ? "rgba(13,126,82,.2)" : "var(--border)"}`,
                background: q.isAnswered ? "rgba(13,126,82,.06)" : "var(--surface)",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 12,
                alignItems: "start",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: ".9rem" }}>{q.authorName}</span>
                  {q.isAnswered && (
                    <span style={{ fontSize: ".75rem", fontWeight: 700, color: "#0d7e52", background: "rgba(13,126,82,.1)", padding: "2px 10px", borderRadius: 20, border: "1px solid rgba(13,126,82,.25)" }}>
                      ✓ Answered
                    </span>
                  )}
                  <span style={{ fontSize: ".75rem", opacity: .5, marginLeft: "auto" }}>
                    {new Date(q.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: ".95rem" }}>{q.message}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button
                  onClick={() => handleMarkAnswered(q.id, q.isAnswered)}
                  style={{
                    padding: "6px 14px",
                    background: q.isAnswered ? "rgba(255,255,255,.06)" : "rgba(13,126,82,.12)",
                    color: q.isAnswered ? "var(--text)" : "#0d7e52",
                    border: `1px solid ${q.isAnswered ? "var(--border)" : "rgba(13,126,82,.25)"}`,
                    borderRadius: 8, cursor: "pointer", fontSize: ".82rem", fontWeight: 600, whiteSpace: "nowrap",
                  }}
                >
                  {q.isAnswered ? "Mark Unanswered" : "Mark Answered"}
                </button>
                <button
                  onClick={() => handleDelete(q.id)}
                  style={{
                    padding: "6px 14px", background: "rgba(239,68,68,.08)", color: "#ef4444",
                    border: "1px solid rgba(239,68,68,.2)", borderRadius: 8, cursor: "pointer",
                    fontSize: ".82rem", fontWeight: 600,
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
