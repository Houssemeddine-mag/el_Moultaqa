import { useState, useEffect, useCallback } from "react";
import { Users, Calendar, Mic, Star, Ticket, Bell, HelpCircle, RefreshCw, FileText, ThumbsUp, AlertTriangle, X } from "lucide-react";
import backend from "../backend.js";

const STAT_META = {
  users:         { label: "Users",         icon: Users,      protected: true },
  events:        { label: "Events",        icon: Calendar,   protected: true },
  sessions:      { label: "Sessions",      icon: Mic,        protected: false },
  speakers:      { label: "Speakers",      icon: Star,       protected: false },
  presentations: { label: "Presentations", icon: FileText,   protected: false },
  ratings:       { label: "Ratings",       icon: ThumbsUp,   protected: false },
  tickets:       { label: "Tickets",       icon: Ticket,     protected: true },
  notifications: { label: "Notifications", icon: Bell,       protected: false },
  questions:     { label: "Questions",     icon: HelpCircle, protected: false },
};

const CLEARABLE = [
  { key: "sessions",      label: "Sessions",      code: "CLEAR_SESSIONS",      icon: Mic,      description: "all sessions/program entries" },
  { key: "speakers",      label: "Speakers",      code: "CLEAR_SPEAKERS",      icon: Star,     description: "all keynote speakers" },
  { key: "presentations", label: "Presentations", code: "CLEAR_PRESENTATIONS", icon: FileText, description: "all presentations" },
  { key: "ratings",       label: "Ratings",       code: "CLEAR_RATINGS",       icon: ThumbsUp, description: null },
  { key: "notifications", label: "Notifications", code: "CLEAR_NOTIFICATIONS", icon: Bell,     description: "all notifications" },
  { key: "questions",     label: "Questions",     code: "CLEAR_QUESTIONS",     icon: HelpCircle, description: "all attendee questions" },
];

const MODAL_OVERLAY = {
  position: "fixed", inset: 0, zIndex: 9999,
  display: "flex", alignItems: "center", justifyContent: "center",
  background: "rgba(0,0,0,0.15)",
  backdropFilter: "blur(2px)",
};

const MODAL_BOX = {
  background: "var(--surface)", borderRadius: 16,
  padding: "28px 32px 24px", maxWidth: 480, width: "90%",
  boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
  border: "1px solid var(--border)",
};

export default function DatabaseManagerPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Loading database statistics…");
  const [confirmModal, setConfirmModal] = useState(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setStatusMessage("Fetching live database statistics…");
      const data = await backend.getDatabaseStats();
      setStats({
        ...data,
        presentations: data.sessions ?? 0,
        ratings: 0,
      });
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

  const openModal = (action) => setConfirmModal(action);
  const closeModal = () => setConfirmModal(null);

  const clearCollection = async (key, label, fetchFn, deleteFn) => {
    try {
      setLoading(true);
      closeModal();
      const items = await fetchFn();
      await Promise.all(items.map((item) => deleteFn(item.id)));
      setStatusMessage(`Deleted ${items.length} ${label.toLowerCase()} from the database.`);
      await loadStats();
    } catch (err) {
      setStatusMessage(`Clear failed: ${err.message}`);
      setLoading(false);
    }
  };

  const confirmAndClear = (action) => {
    switch (action) {
      case "sessions":
        clearCollection("sessions", "Sessions",
          () => backend.getPrograms(),
          (id) => backend.deleteProgram(id)
        );
        break;
      case "speakers":
        clearCollection("speakers", "Speakers",
          () => backend.getKeynoteSpeakers(),
          (id) => backend.deleteKeynoteSpeaker(id)
        );
        break;
      case "presentations":
        clearCollection("presentations", "Presentations",
          () => backend.getPrograms(),
          (id) => backend.deleteProgram(id)
        );
        break;
      case "ratings":
        closeModal();
        setStatusMessage("Ratings are not stored in a separate table yet. No data to clear.");
        break;
      case "notifications":
        clearCollection("notifications", "Notifications",
          () => backend.getNotifications(),
          (id) => backend.deleteNotification(id)
        );
        break;
      case "questions":
        clearCollection("questions", "Questions",
          () => backend.getQuestions(),
          (id) => backend.deleteQuestion(id)
        );
        break;
      case "all": {
        (async () => {
          try {
            setLoading(true);
            closeModal();
            const [programs, speakers, notifs, qs] = await Promise.all([
              backend.getPrograms().catch(() => []),
              backend.getKeynoteSpeakers().catch(() => []),
              backend.getNotifications().catch(() => []),
              backend.getQuestions().catch(() => []),
            ]);
            const total = programs.length + speakers.length + notifs.length + qs.length;
            await Promise.all([
              ...programs.map((p) => backend.deleteProgram(p.id)),
              ...speakers.map((s) => backend.deleteKeynoteSpeaker(s.id)),
              ...notifs.map((n) => backend.deleteNotification(n.id)),
              ...qs.map((q) => backend.deleteQuestion(q.id)),
            ]);
            setStatusMessage(`Cleared all deletable data — removed ${total} record(s) total.`);
            await loadStats();
          } catch (err) {
            setStatusMessage(`Clear all failed: ${err.message}`);
            setLoading(false);
          }
        })();
        break;
      }
    }
  };

  const modalAction = CLEARABLE.find((c) => c.key === confirmModal) || null;
  const isAll = confirmModal === "all";
  const modalCode = isAll ? "CLEAR_ALL" : (modalAction?.code || "");
  const modalLabel = isAll ? "Everything" : (modalAction?.label || "");
  const modalDesc = isAll
    ? "all sessions, speakers, presentations, notifications, and questions"
    : (modalAction?.description || "");
  const isRatings = confirmModal === "ratings";

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
          {loading ? "Loading…" : <><RefreshCw size={16} /> Refresh Stats</>}
        </button>
      </div>

      <div className="status-banner">
        <span>{statusMessage}</span>
      </div>

      {/* Live stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, margin: "24px 0" }}>
        {Object.entries(STAT_META).map(([key, { label, icon: Icon, protected: prot }]) => (
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
            <div style={{ marginBottom: 8, color: "var(--primary)" }}><Icon size={24} /></div>
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

      {/* Clean data base section */}
      <div style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: 6 }}><AlertTriangle size={18} style={{ verticalAlign: "middle", marginRight: 6, color: "#ef4444" }} />Clean data base</h2>
        <p style={{ fontSize: ".85rem", opacity: .65, marginBottom: 16 }}>
          These actions permanently delete records from the database. Protected collections (users, events, tickets) cannot be cleared here.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          {CLEARABLE.map(({ key, label, icon: Icon }) => {
            const isRatings = key === "ratings";
            const count = stats?.[key] ?? "?";
            return (
              <div key={key} style={{ padding: "18px", borderRadius: 12, border: "1px solid rgba(239,68,68,.2)", background: "rgba(239,68,68,.04)" }}>
                <h3 style={{ margin: "0 0 6px", display: "inline-flex", alignItems: "center", gap: 6 }}><Icon size={18} /> {label}</h3>
                <p style={{ fontSize: ".85rem", opacity: .7, margin: "0 0 12px" }}>
                  {isRatings
                    ? "Ratings are not stored in a separate table yet. No data to clear."
                    : `Delete all ${count} ${label.toLowerCase()} from the database.`}
                </p>
                <button
                  type="button"
                  onClick={() => openModal(key)}
                  disabled={loading || isRatings}
                  style={{
                    padding: "8px 18px", background: isRatings ? "rgba(100,100,100,.1)" : "rgba(239,68,68,.12)",
                    color: isRatings ? "#999" : "#ef4444",
                    border: `1px solid ${isRatings ? "rgba(100,100,100,.15)" : "rgba(239,68,68,.25)"}`,
                    borderRadius: 8, cursor: isRatings ? "not-allowed" : "pointer",
                    fontWeight: 700, fontSize: ".85rem",
                  }}
                >
                  Clear {label}
                </button>
              </div>
            );
          })}

          {/* Clear All card */}
          <div style={{ padding: "18px", borderRadius: 12, border: "2px solid rgba(239,68,68,.35)", background: "rgba(239,68,68,.07)" }}>
            <h3 style={{ margin: "0 0 6px", display: "inline-flex", alignItems: "center", gap: 6, color: "#ef4444" }}><AlertTriangle size={18} /> Clear Everything</h3>
            <p style={{ fontSize: ".85rem", opacity: .7, margin: "0 0 12px" }}>
              Permanently delete all sessions, speakers, presentations, notifications, and questions. Users, events, and tickets are preserved.
            </p>
            <button
              type="button"
              onClick={() => openModal("all")}
              disabled={loading}
              style={{
                padding: "8px 18px", background: "#ef4444", color: "#fff",
                border: "none", borderRadius: 8, cursor: "pointer",
                fontWeight: 700, fontSize: ".85rem",
              }}
            >
              Clear Everything
            </button>
          </div>
        </div>
      </div>

      {/* Confirm modal */}
      {confirmModal && (
        <ConfirmModal
          label={modalLabel}
          code={modalCode}
          description={modalDesc}
          isRatings={isRatings}
          onConfirm={() => confirmAndClear(confirmModal)}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

function ConfirmModal({ label, code, description, isRatings, onConfirm, onClose }) {
  const [typed, setTyped] = useState("");
  const isCorrect = typed === code;

  return (
    <div style={MODAL_OVERLAY} onClick={onClose}>
      <div style={MODAL_BOX} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1.15rem", color: "#ef4444", display: "flex", alignItems: "center", gap: 8 }}>
              <AlertTriangle size={20} /> Clear {label}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text)", cursor: "pointer", padding: 4, opacity: .6 }}>
            <X size={20} />
          </button>
        </div>

        {isRatings ? (
          <p style={{ fontSize: ".9rem", color: "var(--text)", opacity: .8, marginBottom: 20 }}>
            Ratings are not yet stored in a separate database table. There is nothing to clear.
          </p>
        ) : (
          <>
            <p style={{ fontSize: ".9rem", color: "var(--text)", opacity: .8, marginBottom: 8 }}>
              You are about to permanently delete <strong>{description}</strong> from the database. This action <strong style={{ color: "#ef4444" }}>cannot be undone</strong>.
            </p>
            <p style={{ fontSize: ".9rem", color: "var(--text)", opacity: .8, marginBottom: 20 }}>
              To confirm, type <code style={{ background: "rgba(239,68,68,.15)", padding: "2px 8px", borderRadius: 4, fontWeight: 700, color: "#ef4444" }}>{code}</code> below:
            </p>
            <input
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={`Type ${code} here...`}
              style={{
                width: "100%", padding: "10px 14px", marginBottom: 20,
                background: "var(--surface-strong)", border: `1px solid ${typed === code ? "#ef4444" : "var(--border)"}`,
                borderRadius: 8, color: "var(--text)", fontSize: ".9rem", outline: "none",
                boxSizing: "border-box",
              }}
              autoFocus
            />
          </>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px", background: "var(--surface-strong)", color: "var(--text)",
              border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer",
              fontWeight: 600, fontSize: ".85rem",
            }}
          >
            Cancel
          </button>
          {!isRatings && (
            <button
              onClick={onConfirm}
              disabled={!isCorrect}
              style={{
                padding: "10px 20px", background: isCorrect ? "#ef4444" : "rgba(239,68,68,.12)",
                color: isCorrect ? "#fff" : "var(--text)", border: "none", borderRadius: 8,
                cursor: isCorrect ? "pointer" : "not-allowed",
                fontWeight: 700, fontSize: ".85rem",
                transition: "background .15s",
              }}
            >
              Yes, delete {label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
