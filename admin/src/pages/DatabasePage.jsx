import { useState, useEffect, useCallback, useRef } from "react";
import {
  Users, Calendar, Mic, Star, Ticket, Bell, HelpCircle, RefreshCw,
  FileText, ThumbsUp, AlertTriangle, X, Download, Database,
  FileSpreadsheet, FileCode, Table, CalendarRange, Podcast, Handshake,
  MonitorPlay, CalendarDays, Monitor, MessageSquareText, BellRing,
} from "lucide-react";
import backend from "../backend.js";
import { downloadCSV, downloadJSON, downloadExcelHTML } from "../utils/exportUtils.js";

// ---------------------------------------------------------------------------
// Shared: stats + delete metadata (from DatabaseManagerPage)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Shared: export metadata (from ExportAllPage)
// ---------------------------------------------------------------------------

const FORMATS = [
  { key: "csv", label: "CSV (Excel)", icon: FileSpreadsheet, desc: "Comma-separated values" },
  { key: "json", label: "JSON", icon: FileCode, desc: "Machine-readable data" },
  { key: "excel", label: "Excel (.xls)", icon: Table, desc: "Formatted HTML table" },
];

const SECTIONS = [
  { key: "users", label: "Users", icon: Users, desc: "Registered attendees with profiles, roles, and demographics" },
  { key: "sessions", label: "Program Sessions", icon: CalendarRange, desc: "Conference schedule with dates, rooms, chairs, and keynote info" },
  { key: "speakers", label: "Keynote Speakers", icon: Podcast, desc: "Speaker profiles with bio, title, institution" },
  { key: "sponsors", label: "Sponsors", icon: Handshake, desc: "Sponsor list with website and display order" },
  { key: "streams", label: "Live Streams", icon: MonitorPlay, desc: "Configured live stream URLs" },
  { key: "events", label: "Events", icon: CalendarDays, desc: "Conference events with dates, location, and status" },
  { key: "presentations", label: "Presentations", icon: Monitor, desc: "All presentations with track, timing, and presenter info" },
  { key: "questions", label: "Q&A Questions", icon: MessageSquareText, desc: "Attendee-submitted questions with answer status" },
  { key: "notifications", label: "Notifications", icon: BellRing, desc: "Broadcast notifications sent to attendees" },
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

const MODE_TOGGLE_WRAP = {
  display: "inline-flex", padding: 4, gap: 4, borderRadius: 14,
  background: "var(--surface-strong)", border: "1px solid var(--border)",
};

function modeBtnStyle(active, danger) {
  return {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "10px 22px", borderRadius: 10, border: "none",
    cursor: "pointer", fontWeight: 700, fontSize: ".9rem", fontFamily: "inherit",
    background: active ? (danger ? "#ef4444" : "var(--primary)") : "transparent",
    color: active ? "#fff" : "var(--muted)",
    transition: "background .15s, color .15s",
  };
}

function FormatMenu({ onSelect, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: "100%",
        right: 0,
        marginTop: 6,
        background: "#fff",
        border: "1px solid var(--border)",
        borderRadius: 12,
        boxShadow: "0 8px 30px rgba(0,0,0,.12)",
        minWidth: 200,
        zIndex: 100,
        overflow: "hidden",
      }}
    >
      {FORMATS.map((fmt) => {
        const Icon = fmt.icon;
        return (
          <button
            key={fmt.key}
            onClick={() => onSelect(fmt.key)}
            style={{
              display: "flex", alignItems: "center", gap: 12, width: "100%",
              padding: "11px 16px", border: "none", background: "transparent",
              cursor: "pointer", fontFamily: "inherit", fontSize: ".85rem",
              textAlign: "left", color: "var(--text)",
              borderBottom: "1px solid rgba(0,0,0,.04)",
              transition: "background .1s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(13,126,82,.08)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            <Icon size={18} style={{ color: "var(--accent)", flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 600 }}>{fmt.label}</div>
              <div style={{ fontSize: ".75rem", opacity: .6 }}>{fmt.desc}</div>
            </div>
          </button>
        );
      })}
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

export default function DatabasePage() {
  const [mode, setMode] = useState("export");

  // ---- stats (shared, always visible) ----
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Loading database statistics…");
  const [confirmModal, setConfirmModal] = useState(null);

  // ---- export data (lazy: fetched on first entering export mode) ----
  const [exportData, setExportData] = useState({});
  const [fetching, setFetching] = useState(false);
  const [exportLoaded, setExportLoaded] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [openAll, setOpenAll] = useState(false);
  const allRef = useRef(null);

  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
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
      console.error("[DatabasePage] stats error:", err);
      setStatusMessage("Failed to load statistics: " + (err.message || "Unknown error"));
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchExportData = useCallback(async () => {
    setFetching(true);
    try {
      const [users, sessions, speakers, sponsors, streams, events, presentations, questions, notifications] = await Promise.all([
        backend.getUsers().catch(() => []),
        backend.getPrograms().catch(() => []),
        backend.getKeynoteSpeakers().catch(() => []),
        backend.getSponsors().catch(() => []),
        backend.getStreams().catch(() => []),
        backend.getEvents().catch(() => []),
        backend.getPrograms().then((s) => (s || []).map((sess) => ({
          title: sess.title || "Untitled",
          presenter: sess.keynote?.name || "TBD",
          affiliation: sess.keynote?.company || "",
          track: sess.type || "session",
          programDate: sess.date || "",
          start: sess.start || "",
          end: sess.end || "",
          room: sess.room || "",
          resume: sess.keynoteDescription || "",
          status: "scheduled",
        }))).catch(() => []),
        backend.getQuestions().catch(() => []),
        backend.getNotifications().catch(() => []),
      ]);

      setExportData({
        users: (users || []).map((u) => ({
          Name: u.displayName, Email: u.email, Role: u.role,
          University: u.university, "School Level": u.schoolLevel,
          Gender: u.gender, Country: u.country, Province: u.province,
          Phone: u.phone, "Profile Complete": u.isProfileComplete ? "Yes" : "No",
          "Created At": u.createdAt ? new Date(u.createdAt).toLocaleString() : "",
        })),
        sessions: (sessions || []).map((s) => ({
          Type: s.type, Title: s.title, Date: s.date,
          Start: s.start, End: s.end, Room: s.room,
          Chairs: Array.isArray(s.chairs) ? s.chairs.join("; ") : s.chairs,
          "Keynote Speaker": s.keynote?.name || "",
          "Keynote Affiliation": s.keynote?.affiliation || "",
        })),
        speakers: (speakers || []).map((s) => ({
          Name: s.name, Title: s.title,
          Institution: s.company || s.institution,
          Bio: s.bio, Photo: s.photo || "",
        })),
        sponsors: (sponsors || []).map((s) => ({
          Name: s.name, Website: s.website, Order: s.order,
          "Has Logo": s.logoData ? "Yes" : "No",
        })),
        streams: (streams || []).map((s) => ({ Name: s.name, URL: s.url })),
        events: (events || []).map((e) => ({
          Title: e.title, Description: e.description,
          "Short Name": e.short_name, "Start Date": e.start_date,
          "End Date": e.end_date, Location: e.location,
          Venue: e.venue, Status: e.status,
        })),
        presentations: (presentations || []).map((p) => ({
          Title: p.title, Presenter: p.presenter,
          Affiliation: p.affiliation, Track: p.track,
          Date: p.programDate, Start: p.start, End: p.end,
          Room: p.room, Resume: p.resume, Status: p.status,
        })),
        questions: (questions || []).map((q) => ({
          Author: q.authorName, Message: q.message,
          Answered: q.isAnswered ? "Yes" : "No",
          "Created At": q.createdAt ? new Date(q.createdAt).toLocaleString() : "",
        })),
        notifications: (notifications || []).map((n) => ({
          Title: n.title, Message: n.message, Type: n.type,
          "Is Pinned": n.isPinned ? "Yes" : "No",
          "Created At": n.createdAt ? new Date(n.createdAt).toLocaleString() : "",
        })),
      });
      setExportLoaded(true);
    } catch (err) {
      console.error("[DatabasePage] export fetch failed:", err);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  useEffect(() => {
    if (mode === "export" && !exportLoaded && !fetching) fetchExportData();
  }, [mode, exportLoaded, fetching, fetchExportData]);

  useEffect(() => {
    const handler = (e) => { if (allRef.current && !allRef.current.contains(e.target)) setOpenAll(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ---- delete actions ----
  const openModal = (action) => setConfirmModal(action);
  const closeModal = () => setConfirmModal(null);

  const clearCollection = async (key, label, fetchFn, deleteFn) => {
    try {
      setStatsLoading(true);
      closeModal();
      const items = await fetchFn();
      await Promise.all(items.map((item) => deleteFn(item.id)));
      setStatusMessage(`Deleted ${items.length} ${label.toLowerCase()} from the database.`);
      await loadStats();
    } catch (err) {
      setStatusMessage(`Clear failed: ${err.message}`);
      setStatsLoading(false);
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
            setStatsLoading(true);
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
            setStatsLoading(false);
          }
        })();
        break;
      }
    }
  };

  // ---- export actions ----
  const download = (format, rows, key) => {
    if (format === "csv") downloadCSV(rows, key);
    else if (format === "json") downloadJSON(rows, key);
    else if (format === "excel") downloadExcelHTML(rows, key);
  };

  const handleSectionExport = (key, format) => {
    setOpenSection(null);
    const rows = exportData[key];
    if (!rows || rows.length === 0) { alert(`No data for "${key}".`); return; }
    download(format, rows, key);
  };

  const handleExportAll = (format) => {
    setOpenAll(false);
    const anyData = SECTIONS.some((s) => exportData[s.key] && exportData[s.key].length > 0);
    if (!anyData) { alert("No data available."); return; }
    SECTIONS.forEach((s) => {
      if (exportData[s.key] && exportData[s.key].length > 0) download(format, exportData[s.key], s.key);
    });
  };

  const totalRows = SECTIONS.reduce((sum, s) => sum + ((exportData[s.key] || []).length), 0);

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
          <h1>Database</h1>
          <p className="subtitle">Live row counts from Supabase — export data or clean up collections.</p>
        </div>
        <button
          type="button"
          className="landing-cta"
          onClick={loadStats}
          disabled={statsLoading}
          style={{ background: "var(--surface-strong)", border: "1px solid var(--border)", color: "var(--text)" }}
        >
          {statsLoading ? "Loading…" : <><RefreshCw size={16} /> Refresh Stats</>}
        </button>
      </div>

      <div style={MODE_TOGGLE_WRAP} role="tablist" aria-label="Database mode">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "export"}
          onClick={() => setMode("export")}
          style={modeBtnStyle(mode === "export", false)}
        >
          <Download size={16} /> Export
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "delete"}
          onClick={() => setMode("delete")}
          style={modeBtnStyle(mode === "delete", true)}
        >
          <AlertTriangle size={16} /> Delete
        </button>
      </div>

      {/* Live stats grid (shared by both modes) */}
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
              {statsLoading ? "…" : (stats?.[key] ?? 0)}
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

      {mode === "export" ? (
        <>
          <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
            <button
              className="secondary-button"
              onClick={fetchExportData}
              disabled={fetching}
              style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <RefreshCw size={16} className={fetching ? "spin" : ""} />
              {fetching ? "Loading..." : "Refresh Data"}
            </button>
            <div
              ref={allRef}
              style={{ position: "relative" }}
              onMouseEnter={() => { if (!fetching && totalRows > 0) setOpenAll(true); }}
              onMouseLeave={() => setOpenAll(false)}
            >
              <button
                className="primary-button"
                onClick={() => setOpenAll(!openAll)}
                disabled={fetching || totalRows === 0}
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                <Download size={16} />
                Export All ({totalRows})
                <span style={{ fontSize: ".65rem", marginLeft: 2 }}>▾</span>
              </button>
              {openAll && <FormatMenu onSelect={handleExportAll} onClose={() => setOpenAll(false)} />}
            </div>
          </div>

          {fetching && (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)" }}>
              <RefreshCw size={32} style={{ marginBottom: 12 }} />
              <p>Loading all data...</p>
            </div>
          )}

          {!fetching && totalRows === 0 && (
            <div className="empty-state">
              <Database size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
              <h3>No data available</h3>
              <p className="subtitle">Click "Refresh Data" to load your conference data.</p>
            </div>
          )}

          {!fetching && totalRows > 0 && (
            <div style={{ display: "grid", gap: 12 }}>
              {SECTIONS.map((section) => {
                const rows = exportData[section.key] || [];
                const SectionIcon = section.icon;
                return (
                  <div
                    key={section.key}
                    className="export-section-row"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "18px 22px", borderRadius: 14,
                      border: "1px solid var(--border)",
                      background: "linear-gradient(135deg, var(--surface) 0%, rgba(13,126,82,.03) 100%)",
                      gap: 16,
                      transition: "box-shadow .2s",
                      cursor: "default",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(13,126,82,.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
                      <SectionIcon size={26} style={{ color: "var(--accent)", flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: ".95rem", color: "var(--text)" }}>{section.label}</div>
                        <div style={{ fontSize: ".8rem", color: "var(--muted)", opacity: 0.7, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{section.desc}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
                      <span
                        style={{
                          fontWeight: 700, fontSize: ".95rem", color: "var(--accent)",
                          background: "rgba(13,126,82,.08)", padding: "4px 12px",
                          borderRadius: 20, border: "1px solid rgba(13,126,82,.15)",
                        }}
                      >
                        {rows.length} rows
                      </span>
                      <div
                        style={{ position: "relative" }}
                        onMouseEnter={() => { if (rows.length > 0) setOpenSection(section.key); }}
                        onMouseLeave={() => setOpenSection((cur) => (cur === section.key ? null : cur))}
                      >
                        <button
                          className="primary-button"
                          onClick={() => setOpenSection(openSection === section.key ? null : section.key)}
                          disabled={rows.length === 0}
                          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 18px", fontSize: ".82rem" }}
                        >
                          <Download size={14} /> Export <span style={{ fontSize: ".6rem", marginLeft: 2 }}>▾</span>
                        </button>
                        {openSection === section.key && (
                          <FormatMenu
                            onSelect={(fmt) => handleSectionExport(section.key, fmt)}
                            onClose={() => setOpenSection(null)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="status-banner">
            <span>{statusMessage}</span>
          </div>

          <div style={{ marginTop: 24 }}>
            <h2 style={{ fontSize: "1.1rem", marginBottom: 6 }}><AlertTriangle size={18} style={{ verticalAlign: "middle", marginRight: 6, color: "#ef4444" }} />Clean data base</h2>
            <p style={{ fontSize: ".85rem", opacity: .65, marginBottom: 16 }}>
              These actions permanently delete records from the database. Protected collections (users, events, tickets) cannot be cleared here.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
              {CLEARABLE.map(({ key, label, icon: Icon }) => {
                const disabled = key === "ratings";
                const count = stats?.[key] ?? "?";
                return (
                  <div key={key} style={{ padding: "18px", borderRadius: 12, border: "1px solid rgba(239,68,68,.2)", background: "rgba(239,68,68,.04)" }}>
                    <h3 style={{ margin: "0 0 6px", display: "inline-flex", alignItems: "center", gap: 6 }}><Icon size={18} /> {label}</h3>
                    <p style={{ fontSize: ".85rem", opacity: .7, margin: "0 0 12px" }}>
                      {disabled
                        ? "Ratings are not stored in a separate table yet. No data to clear."
                        : `Delete all ${count} ${label.toLowerCase()} from the database.`}
                    </p>
                    <button
                      type="button"
                      onClick={() => openModal(key)}
                      disabled={statsLoading || disabled}
                      style={{
                        padding: "8px 18px", background: disabled ? "rgba(100,100,100,.1)" : "rgba(239,68,68,.12)",
                        color: disabled ? "#999" : "#ef4444",
                        border: `1px solid ${disabled ? "rgba(100,100,100,.15)" : "rgba(239,68,68,.25)"}`,
                        borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer",
                        fontWeight: 700, fontSize: ".85rem",
                      }}
                    >
                      Clear {label}
                    </button>
                  </div>
                );
              })}

              <div style={{ padding: "18px", borderRadius: 12, border: "2px solid rgba(239,68,68,.35)", background: "rgba(239,68,68,.07)" }}>
                <h3 style={{ margin: "0 0 6px", display: "inline-flex", alignItems: "center", gap: 6, color: "#ef4444" }}><AlertTriangle size={18} /> Clear Everything</h3>
                <p style={{ fontSize: ".85rem", opacity: .7, margin: "0 0 12px" }}>
                  Permanently delete all sessions, speakers, presentations, notifications, and questions. Users, events, and tickets are preserved.
                </p>
                <button
                  type="button"
                  onClick={() => openModal("all")}
                  disabled={statsLoading}
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
        </>
      )}
    </div>
  );
}
