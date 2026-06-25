import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSuperAdmin } from "../backend.js";

const TABS = [
  { key: "events", label: "Events", table: "events" },
  { key: "users", label: "Users", table: "users" },
  { key: "sessions", label: "Sessions", table: "sessions" },
  { key: "sponsors", label: "Sponsors", table: "sponsors" },
  { key: "speakers", label: "Speakers", table: "speakers" },
  { key: "venues", label: "Venues", table: "venues" },
];

function EntityTable({ schema, table, sa }) {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!schema) return;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await sa.orgQuery(schema, table, {}, 200, 0, "created_at", "DESC");
        if (data && data.length > 0) {
          setRows(data);
          setColumns(Object.keys(data[0]));
        } else {
          setRows([]);
          setColumns([]);
        }
      } catch (e) {
        setError(e.message);
        setRows([]);
        setColumns([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [schema, table]);

  if (loading) return <div className="sa-loading-container" style={{ padding: 40 }}><div className="sa-loading-spinner" /></div>;
  if (error) return <div className="sa-error-banner">{error}</div>;

  const skipCols = ["raw_user_meta_data", "clerk_id", "auth_id", "password_hash", "image_url", "image"];

  return (
    <div className="sa-table-wrap">
      <table className="sa-table">
        <thead>
          <tr>
            {columns.filter(c => !skipCols.includes(c)).slice(0, 8).map(c => (
              <th key={c}>{c.replace(/_/g, " ")}</th>
            ))}
            {columns.length > 8 && <th>...</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id || i}>
              {columns.filter(c => !skipCols.includes(c)).slice(0, 8).map(c => (
                <td key={c}>{formatCell(row[c])}</td>
              ))}
              {columns.length > 8 && <td className="sa-muted">+{columns.length - 8}</td>}
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={Math.min(columns.length, 9) || 1} className="sa-empty">No {table} found</td></tr>}
        </tbody>
      </table>
      {rows.length > 0 && <div className="sa-table-footer">{rows.length} rows</div>}
    </div>
  );
}

function formatCell(val) {
  if (val === null || val === undefined) return <span className="sa-muted">—</span>;
  if (typeof val === "boolean") return val ? "Yes" : "No";
  if (typeof val === "object") return <span className="sa-muted">{JSON.stringify(val).slice(0, 60)}</span>;
  if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}T/.test(val)) {
    return new Date(val).toLocaleString();
  }
  return String(val);
}

export default function OrgDetailPage() {
  const { orgSlug } = useParams();
  const navigate = useNavigate();
  const sa = useSuperAdmin();
  const [org, setOrg] = useState(null);
  const [activeTab, setActiveTab] = useState("events");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orgSlug) return;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const orgs = await sa.listOrganizations();
        const found = orgs.find(o => o.slug === orgSlug);
        if (!found) { setError("Organization not found"); return; }
        setOrg(found);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [orgSlug]);

  if (loading) return <div className="sa-loading-shell"><div className="sa-loading-container"><div className="sa-loading-spinner" /></div></div>;
  if (error) return <div className="sa-page"><div className="sa-error-banner">{error} <button className="sa-btn sa-btn-ghost" onClick={() => navigate("/system/organizations")}>Back to Organizations</button></div></div>;
  if (!org) return null;

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <button className="sa-btn sa-btn-ghost sa-btn-sm sa-back-btn" onClick={() => navigate("/system/organizations")}>
            &larr; Organizations
          </button>
          <h1 style={{ marginTop: 8 }}>{org.name}</h1>
          <p className="sa-muted">{org.slug} &middot; Schema: {org.schema_name || org.slug} &middot; Plan: {org.plan_name || "None"}</p>
        </div>
        <div className="sa-org-meta">
          <div className="sa-stat-mini">
            <span className="sa-stat-mini-value">{org.user_count}</span>
            <span className="sa-stat-mini-label">Users</span>
          </div>
          <div className="sa-stat-mini">
            <span className="sa-stat-mini-value">{org.event_count}</span>
            <span className="sa-stat-mini-label">Events</span>
          </div>
        </div>
      </div>

      <div className="sa-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`sa-tab ${activeTab === tab.key ? "sa-tab-active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="sa-tab-content">
        {TABS.filter(t => t.key === activeTab).map(tab => (
          <EntityTable key={tab.key} schema={org.schema_name || org.slug} table={tab.table} sa={sa} />
        ))}
      </div>
    </div>
  );
}
