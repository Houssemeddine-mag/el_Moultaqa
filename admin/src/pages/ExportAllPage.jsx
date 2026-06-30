import { useState, useEffect, useRef } from "react";
import {
  Download, Database, RefreshCw, FileSpreadsheet, FileCode, Table,
  Users, Calendar, Mic, Building2, Video, CalendarCheck, FileText, HelpCircle, Bell,
} from "lucide-react";
import backend from "../backend.js";
import { downloadCSV, downloadJSON, downloadExcelHTML } from "../utils/exportUtils.js";

const FORMATS = [
  { key: "csv", label: "CSV (Excel)", icon: FileSpreadsheet, desc: "Comma-separated values" },
  { key: "json", label: "JSON", icon: FileCode, desc: "Machine-readable data" },
  { key: "excel", label: "Excel (.xls)", icon: Table, desc: "Formatted HTML table" },
];

const SECTIONS = [
  { key: "users", label: "Users", icon: Users, desc: "Registered attendees with profiles, roles, and demographics" },
  { key: "sessions", label: "Program Sessions", icon: Calendar, desc: "Conference schedule with dates, rooms, chairs, and keynote info" },
  { key: "speakers", label: "Keynote Speakers", icon: Mic, desc: "Speaker profiles with bio, title, institution" },
  { key: "sponsors", label: "Sponsors", icon: Building2, desc: "Sponsor list with website and display order" },
  { key: "streams", label: "Live Streams", icon: Video, desc: "Configured live stream URLs" },
  { key: "events", label: "Events", icon: CalendarCheck, desc: "Conference events with dates, location, and status" },
  { key: "presentations", label: "Presentations", icon: FileText, desc: "All presentations with track, timing, and presenter info" },
  { key: "questions", label: "Q&A Questions", icon: HelpCircle, desc: "Attendee-submitted questions with answer status" },
  { key: "notifications", label: "Notifications", icon: Bell, desc: "Broadcast notifications sent to attendees" },
];

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

export default function ExportAllPage() {
  const [data, setData] = useState({});
  const [fetching, setFetching] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [openAll, setOpenAll] = useState(false);
  const allRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (allRef.current && !allRef.current.contains(e.target)) setOpenAll(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchAll = async () => {
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

      setData({
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
    } catch (err) {
      console.error("[ExportAll] Failed:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const download = (format, rows, key) => {
    if (format === "csv") downloadCSV(rows, key);
    else if (format === "json") downloadJSON(rows, key);
    else if (format === "excel") downloadExcelHTML(rows, key);
  };

  const handleSectionExport = (key, format) => {
    setOpenSection(null);
    const rows = data[key];
    if (!rows || rows.length === 0) { alert(`No data for "${key}".`); return; }
    download(format, rows, key);
  };

  const handleExportAll = (format) => {
    setOpenAll(false);
    const anyData = SECTIONS.some((s) => data[s.key] && data[s.key].length > 0);
    if (!anyData) { alert("No data available."); return; }
    SECTIONS.forEach((s) => {
      if (data[s.key] && data[s.key].length > 0) download(format, data[s.key], s.key);
    });
  };

  const totalRows = SECTIONS.reduce((sum, s) => sum + ((data[s.key] || []).length), 0);

  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h1>Export All Data</h1>
          <p className="subtitle">Download your conference data in CSV, JSON, or Excel format.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="secondary-button"
            onClick={fetchAll}
            disabled={fetching}
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <RefreshCw size={16} className={fetching ? "spin" : ""} />
            {fetching ? "Loading..." : "Refresh Data"}
          </button>
          <div ref={allRef} style={{ position: "relative" }}>
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
            const rows = data[section.key] || [];
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
                  transition: "box-shadow .2s, transform .2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(13,126,82,.1)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: "linear-gradient(135deg, rgba(13,126,82,.1) 0%, rgba(31,182,154,.1) 100%)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <SectionIcon size={22} style={{ color: "var(--accent)" }} />
                  </div>
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
                  <div style={{ position: "relative" }}>
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
    </div>
  );
}
