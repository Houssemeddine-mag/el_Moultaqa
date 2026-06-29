import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSuperAdmin } from "../backend.js";

function formatCell(val) {
  if (val === null || val === undefined) return <span className="sa-muted">&mdash;</span>;
  if (typeof val === "boolean") return val ? "Yes" : "No";
  if (typeof val === "object") return <span className="sa-muted">{JSON.stringify(val).slice(0, 60)}</span>;
  if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}T/.test(val)) return new Date(val).toLocaleString();
  return String(val);
}

/* ── Editable cell ── */
function EditableCell({ value, col, rowId, schema, table, sa, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef(null);
  const skipCols = ["id","clerk_user_id","auth_id","password_hash","raw_user_meta_data","created_at","updated_at"];
  if (skipCols.includes(col) || col === "id") return <td>{formatCell(value)}</td>;

  const handleStart = () => { setDraft(value === null || value === undefined ? "" : String(value)); setEditing(true); };
  const handleSave = async () => {
    setEditing(false);
    if (draft === String(value ?? "")) return;
    try { await sa.orgUpdate(schema, table, rowId, { [col]: draft }); onSave(rowId, col, draft); }
    catch (e) { console.error("Edit failed", e); }
  };
  const handleKey = (e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setEditing(false); };
  useEffect(() => { if (editing && inputRef.current) inputRef.current.focus(); }, [editing]);

  if (editing) return <td><input ref={inputRef} className="sa-inline-input" value={draft} onChange={e => setDraft(e.target.value)} onBlur={handleSave} onKeyDown={handleKey} /></td>;
  return <td onDoubleClick={handleStart} className="sa-editable-cell">{formatCell(value)}</td>;
}

/* ── Editable table view ── */
function EditableTableView({ schema, table, sa }) {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [newRow, setNewRow] = useState({});
  const load = async () => {
    if (!schema) return; setLoading(true); setError("");
    try {
      const data = await sa.orgQuery(schema, table, {}, 500, 0, "created_at", "DESC");
      setRows(data || []); setColumns(data && data.length > 0 ? Object.keys(data[0]) : []);
    } catch (e) { setError(e.message); setRows([]); setColumns([]); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [schema, table]);

  const handleCellSave = (rowId, col, val) => setRows(prev => prev.map(r => r.id === rowId ? { ...r, [col]: val } : r));
  const handleDeleteRow = async (rowId) => { try { await sa.orgDelete(schema, table, rowId); setRows(prev => prev.filter(r => r.id !== rowId)); } catch (e) { console.error(e); } };
  const handleAddRow = async () => {
    if (Object.keys(newRow).length === 0) return;
    try { const result = await sa.orgInsert(schema, table, newRow); setRows(prev => [result, ...prev]); setNewRow({}); setAdding(false); } catch (e) { console.error(e); }
  };
  const skipCols = ["raw_user_meta_data", "auth_id", "password_hash"];
  if (loading) return <div className="sa-loading-container" style={{ padding: 40 }}><div className="sa-loading-spinner" /></div>;
  if (error) return <div className="sa-error-banner">{error}</div>;

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
        <button className="sa-btn sa-btn-primary sa-btn-sm" onClick={() => { setAdding(!adding); setNewRow({}); }}>{adding ? "Cancel" : "+ Add Row"}</button>
        <span className="sa-muted" style={{ fontSize: ".85rem" }}>{rows.length} rows</span>
      </div>
      {adding && (
        <div className="sa-inline-add">
          {columns.filter(c => !skipCols.includes(c) && c !== "id" && c !== "created_at" && c !== "updated_at").slice(0, 6).map(col => (
            <input key={col} placeholder={col} value={newRow[col] || ""} onChange={e => setNewRow(r => ({ ...r, [col]: e.target.value }))} />
          ))}
          <button className="sa-btn sa-btn-primary sa-btn-sm" onClick={handleAddRow}>Add</button>
        </div>
      )}
      <div className="sa-table-wrap" style={{ overflowX: "auto" }}>
        <table className="sa-table">
          <thead><tr><th style={{ width: 40 }} />{columns.filter(c => !skipCols.includes(c)).map(c => <th key={c}>{c.replace(/_/g, " ")}</th>)}</tr></thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id}>
                <td><button className="sa-btn sa-btn-sm sa-btn-danger" onClick={() => handleDeleteRow(row.id)} style={{ padding: "2px 6px", fontSize: ".7rem" }}>X</button></td>
                {columns.filter(c => !skipCols.includes(c)).map(c => <EditableCell key={c} value={row[c]} col={c} rowId={row.id} schema={schema} table={table} sa={sa} onSave={(rid, col, val) => handleCellSave(rid, col, val)} />)}
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={columns.length + 1} className="sa-empty">No {table} found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Stat card ── */
function StatCard({ label, count, icon, color }) {
  return (
    <div className="sa-stat-card" style={{ borderTop: `3px solid ${color}` }}>
      <div className="sa-stat-value">{count}</div>
      <div className="sa-stat-label">{label}</div>
    </div>
  );
}

/* ── Visual entity cards ── */
function VisualCards({ schema, tab, sa }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!schema) return;
    (async () => { setLoading(true); try { setData(await sa.orgQuery(schema, tab, {}, 50) || []); } catch { setData([]); } finally { setLoading(false); } })();
  }, [schema, tab]);

  if (loading) return <div className="sa-loading-container" style={{ padding: 20 }}><div className="sa-loading-spinner" /></div>;

  const config = {
    events: { fields: ["title", "short_name", "start_date", "status", "location"], titleKey: "title", badgeKey: "status" },
    users: { fields: ["full_name", "email", "role", "institution"], titleKey: "full_name", badgeKey: "role" },
    sessions: { fields: ["title", "speaker_id", "start_time", "room", "track"], titleKey: "title", badgeKey: "session_type" },
    sponsors: { fields: ["name", "level", "website"], titleKey: "name", badgeKey: "level" },
    speakers: { fields: ["full_name", "title", "company", "bio"], titleKey: "full_name", badgeKey: null },
  };

  const cfg = config[tab] || { fields: ["id"], titleKey: "id", badgeKey: null };
  const badgeColors = { active: "#0d7e52", published: "#0d7e52", draft: "#6b7280", admin: "#2563eb", speaker: "#7c3aed", attendee: "#0891b2", moderator: "#d97706", platinum: "#0d7e52", gold: "#d97706", silver: "#6b7280" };

  return (
    <div className="sa-visual-cards">
      {data.length === 0 && <div className="sa-empty" style={{ gridColumn: "1 / -1" }}>No {tab} yet</div>}
      {data.map(item => (
        <div key={item.id} className="sa-visual-card">
          <div className="sa-visual-card-header">
            <strong>{item[cfg.titleKey] || item.id}</strong>
            {cfg.badgeKey && item[cfg.badgeKey] && <span className="sa-badge" style={{ background: badgeColors[item[cfg.badgeKey]] || "#6b7280", color: "#fff" }}>{item[cfg.badgeKey]}</span>}
          </div>
          <div className="sa-visual-card-body">
            {cfg.fields.filter(f => f !== cfg.titleKey && f !== cfg.badgeKey).map(f => (
              <div key={f} className="sa-visual-card-field">
                <span className="sa-muted">{f.replace(/_/g, " ")}</span>
                <span>{formatCell(item[f])}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main page ── */
export default function OrgDetailPage() {
  const { orgSlug } = useParams();
  const navigate = useNavigate();
  const sa = useSuperAdmin();
  const [org, setOrg] = useState(null);
  const [counts, setCounts] = useState(null);
  const [activeTab, setActiveTab] = useState("events");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tableMode, setTableMode] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [discStatus, setDiscStatus] = useState(null);
  const [discAction, setDiscAction] = useState(null);

  useEffect(() => {
    if (!orgSlug) return;
    (async () => {
      setLoading(true); setError("");
      try {
        const orgs = await sa.listOrganizations();
        const found = orgs.find(o => o.slug === orgSlug);
        if (!found) { setError("Organization not found"); return; }
        setOrg(found);
        const schema = found.schema_name || found.slug;
        sa.getOrgTableCounts(schema).then(setCounts).catch(() => {});
      } catch (e) { setError(e.message); } finally { setLoading(false); }
    })();
  }, [orgSlug]);

  useEffect(() => {
    if (!orgSlug) return;
    (async () => {
      try {
        const list = await sa.listOrgsDiscoveryStatus();
        const found = list.find((d) => d.org_slug === orgSlug);
        setDiscStatus(found || null);
      } catch (e) {
        console.error("[OrgDetailPage] load discovery status error:", e);
      }
    })();
  }, [orgSlug]);

  const handleSelectTable = (t) => { setSelectedTable(t); setTableMode(true); setShowTablePicker(false); };

  if (loading) return <div className="sa-loading-shell"><div className="sa-loading-container"><div className="sa-loading-spinner" /></div></div>;
  if (error) return <div className="sa-page"><div className="sa-error-banner">{error} <button className="sa-btn sa-btn-ghost" onClick={() => navigate("/system/organizations")}>Back</button></div></div>;
  if (!org) return null;

  const schema = org.schema_name || org.slug;
  const statCards = counts ? [
    { label: "Users", count: counts.users || 0, color: "#2563eb", icon: "U" },
    { label: "Events", count: counts.events || 0, color: "#0d7e52", icon: "E" },
    { label: "Sessions", count: counts.sessions || 0, color: "#7c3aed", icon: "S" },
    { label: "Speakers", count: counts.speakers || 0, color: "#d97706", icon: "S" },
    { label: "Sponsors", count: counts.sponsors || 0, color: "#0891b2", icon: "S" },
    { label: "Venues", count: counts.venues || 0, color: "#be123c", icon: "V" },
  ] : [];

  const VISUAL_TABS = [
    { key: "events", label: "Events" },
    { key: "users", label: "Users" },
    { key: "sessions", label: "Sessions" },
    { key: "sponsors", label: "Sponsors" },
    { key: "speakers", label: "Speakers" },
  ];

  const ALL_TABLES = [
    "users", "events", "sessions", "speakers", "sponsors", "venues", "tickets", "notifications", "questions",
  ];

  const isBlocked = org.blocked_at;

  return (
    <div className="sa-page">
      {isBlocked && (
        <div className="sa-blocked-banner">
          <strong>&#x1f512; Blocked</strong> This organization was blocked on {new Date(org.blocked_at).toLocaleString()}. Users cannot access it.
        </div>
      )}
      <div className="sa-page-header" style={{ marginBottom: 12 }}>
        <div>
          <button className="sa-btn sa-btn-ghost sa-btn-sm sa-back-btn" onClick={() => navigate("/system/organizations")}>&larr; Organizations</button>
          <h1 style={{ marginTop: 4 }}>{org.name} {isBlocked && <span className="sa-badge" style={{ background: "#dc2626", color: "#fff", fontSize: ".75rem", verticalAlign: "middle" }}>Blocked</span>}</h1>
          <p className="sa-muted">{org.slug} &middot; {org.plan_name || "No plan"} &middot; Created {new Date(org.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      {/* ── Discovery Management section ── */}
      <section className="sa-section">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>Discovery</h2>
        </div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center", padding: "16px 20px", background: "var(--sa-surface)", border: "1px solid var(--sa-border)", borderRadius: 12 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <strong style={{ fontSize: ".85rem", minWidth: 80 }}>Status:</strong>
            {discStatus?.discovery_enabled ? (
              <span className="sa-badge" style={{ background: "#0d7e52", color: "#fff" }}>Enabled</span>
            ) : (
              <span className="sa-badge" style={{ background: "#6b7280", color: "#fff" }}>Disabled</span>
            )}
            {discStatus?.card_published && (
              <span className="sa-badge" style={{ background: "#2563eb", color: "#fff" }}>Published</span>
            )}
            {discStatus?.card_blocked && (
              <span className="sa-badge" style={{ background: "#dc2626", color: "#fff" }}>Blocked</span>
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className={`sa-btn sa-btn-sm ${discStatus?.discovery_enabled ? "sa-btn-sm-outline-warn" : "sa-btn-primary"}`}
              onClick={async () => {
                setDiscAction("enable");
                try {
                  await sa.toggleDiscoveryEnable(orgSlug, !discStatus?.discovery_enabled);
                  const list = await sa.listOrgsDiscoveryStatus();
                  setDiscStatus(list.find((d) => d.org_slug === orgSlug) || null);
                } catch (e) { setError(e.message); }
                finally { setDiscAction(null); }
              }}
              disabled={discAction === "enable"}
            >
              {discAction === "enable" ? "..." : discStatus?.discovery_enabled ? "Disable" : "Enable"}
            </button>
            <button
              className={`sa-btn sa-btn-sm ${discStatus?.card_blocked ? "sa-btn-primary" : "sa-btn-sm-outline-warn"}`}
              onClick={async () => {
                setDiscAction("block");
                try {
                  await sa.toggleDiscoveryBlock(orgSlug, !discStatus?.card_blocked);
                  const list = await sa.listOrgsDiscoveryStatus();
                  setDiscStatus(list.find((d) => d.org_slug === orgSlug) || null);
                } catch (e) { setError(e.message); }
                finally { setDiscAction(null); }
              }}
              disabled={discAction === "block" || !discStatus?.discovery_enabled}
            >
              {discAction === "block" ? "..." : discStatus?.card_blocked ? "Unblock" : "Block"}
            </button>
          </div>
          {discStatus && (
            <span className="sa-muted" style={{ fontSize: ".82rem" }}>
              Title: {discStatus.card_title || "—"} &middot;
              Category: {discStatus.card_category || "—"} &middot;
              {discStatus.card_start_date && ` ${discStatus.card_start_date} – ${discStatus.card_end_date || ""}`}
            </span>
          )}
        </div>
      </section>

      <hr className="sa-section-divider" />

      {/* ── Statistics section ── */}
      <section className="sa-section">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>Statistics</h2>
          <div className="sa-table-picker-wrap">
            <button className="sa-btn sa-btn-primary sa-btn-sm" onClick={() => setShowTablePicker(!showTablePicker)}>
              View Tables &darr;
            </button>
            {showTablePicker && (
              <div className="sa-table-picker-dropdown">
                {ALL_TABLES.map(t => (
                  <button key={t} className={`sa-table-picker-item ${selectedTable === t && tableMode ? "active" : ""}`} onClick={() => handleSelectTable(t)}>
                    {t.replace(/_/g, " ")}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="sa-stats-grid">
          {statCards.map(s => <StatCard key={s.label} {...s} />)}
          {!counts && <p className="sa-muted" style={{ gridColumn: "1 / -1" }}>Loading statistics...</p>}
        </div>
      </section>

      {/* ── Separator ── */}
      <hr className="sa-section-divider" />

      {tableMode && selectedTable ? (
        /* ── Editable table view ── */
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, textTransform: "capitalize" }}>{selectedTable.replace(/_/g, " ")}</h2>
            <button className="sa-btn sa-btn-ghost sa-btn-sm" onClick={() => { setTableMode(false); setSelectedTable(null); }}>&larr; Back to data view</button>
          </div>
          <EditableTableView schema={schema} table={selectedTable} sa={sa} />
        </div>
      ) : (
        /* ── Visual data view ── */
        <section className="sa-section">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>Data</h2>
            <nav className="sa-tabs" style={{ margin: 0, border: "none" }}>
              {VISUAL_TABS.map(tab => (
                <button key={tab.key} className={`sa-tab ${activeTab === tab.key ? "sa-tab-active" : ""}`} style={{ padding: "6px 14px", fontSize: ".82rem" }} onClick={() => setActiveTab(tab.key)}>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="sa-tab-content">
            {VISUAL_TABS.filter(t => t.key === activeTab).map(tab => (
              <VisualCards key={tab.key} schema={schema} tab={tab.key} sa={sa} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
