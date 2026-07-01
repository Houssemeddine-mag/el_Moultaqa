import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSuperAdmin } from "../backend.js";

function CreateOrgModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    name: "", shortName: "", themeColor: "#0d7e52", logo: "",
    startDate: "", endDate: "", regMode: "public", adminEmail: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const slug = form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "").replace(/\-+/g, "-").replace(/^-|-$/g, "") || "conference";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.adminEmail.trim()) {
      setError("Conference name and admin email are required.");
      return;
    }
    setLoading(true);
    try {
      await onCreate({
        name: form.name.trim(),
        slug: form.shortName.trim() || slug,
        adminEmail: form.adminEmail.trim(),
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sa-modal-overlay" onClick={onClose}>
      <div className="sa-modal sa-modal-wide" onClick={e => e.stopPropagation()}>
        <div className="sa-modal-header">
          <h2>Create a Conference</h2>
          <button className="sa-modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="sa-form-row">
            <label>Conference name<input type="text" value={form.name} onChange={e => update("name", e.target.value)} placeholder="ElMoultaqa Summit 2026" /></label>
            <label>Short name<input type="text" value={form.shortName} onChange={e => update("shortName", e.target.value)} placeholder="summit-2026" /><span className="sa-muted" style={{ fontSize: ".75rem" }}>slug: {slug}</span></label>
          </div>
          <div className="sa-form-row sa-form-row-3">
            <label>Theme color<input type="color" value={form.themeColor} onChange={e => update("themeColor", e.target.value)} /></label>
            <label style={{ flex: 2 }}>Logo URL<input type="text" value={form.logo} onChange={e => update("logo", e.target.value)} placeholder="https://.../logo.png" /></label>
          </div>
          <div className="sa-form-row">
            <label>Start date<input type="date" value={form.startDate} onChange={e => update("startDate", e.target.value)} /></label>
            <label>End date<input type="date" value={form.endDate} onChange={e => update("endDate", e.target.value)} /></label>
          </div>
          <label>Admin email<input type="email" value={form.adminEmail} onChange={e => update("adminEmail", e.target.value)} placeholder="admin@example.com" /></label>
          <label className="sa-checkbox-label" style={{ marginTop: 4 }}>
            <input type="checkbox" checked={form.regMode === "private"} onChange={e => update("regMode", e.target.checked ? "private" : "public")} />
            Private registration (requires invite code)
          </label>
          {error && <p className="sa-login-error">{error}</p>}
          <div className="sa-modal-actions">
            <button type="button" className="sa-btn sa-btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="sa-btn sa-btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Launch Conference"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const color = status === "active" ? "#0d7e52" : status === "past_due" ? "#d97706" : "#6b7280";
  return <span className="sa-badge" style={{ background: color, color: "#fff" }}>{status}</span>;
}

export default function OrganizationsPage() {
  const navigate = useNavigate();
  const sa = useSuperAdmin();
  const [orgs, setOrgs] = useState([]);
  const [ownerEmails, setOwnerEmails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [actionSlug, setActionSlug] = useState(null);

  async function loadOrgs() {
    try {
      setLoading(true);
      const data = await sa.listOrganizations();
      setOrgs(data);
      loadOwnerEmails(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadOwnerEmails(orgList) {
    const results = await Promise.allSettled(
      orgList.map(async (org) => {
        const schema = org.schema_name || org.slug;
        try {
          const users = await sa.orgQuery(schema, "users", { clerk_user_id: org.owner_clerk_id }, 1);
          const owner = users && users.length > 0 ? users[0] : null;
          return { slug: org.slug, email: owner?.email || "" };
        } catch {
          return { slug: org.slug, email: "" };
        }
      })
    );
    const map = {};
    results.forEach((r) => {
      if (r.status === "fulfilled") map[r.value.slug] = r.value.email;
    });
    setOwnerEmails(map);
  }

  useEffect(() => { loadOrgs(); }, []);

  const handleCreate = async (data) => {
    await sa.createOrganization(data);
    await loadOrgs();
  };

  const handleDelete = async (org) => {
    if (!window.confirm(`Delete "${org.name}" (${org.slug})? This will permanently drop the entire schema and all data.`)) return;
    setActionSlug(org.slug);
    try {
      await sa.deleteOrganization(org.slug);
      await loadOrgs();
    } catch (e) {
      setError(e.message);
    } finally {
      setActionSlug(null);
    }
  };

  const handleBlockToggle = async (org) => {
    setActionSlug(org.slug);
    try {
      if (org.blocked_at) {
        await sa.unblockOrganization(org.slug);
      } else {
        await sa.blockOrganization(org.slug);
      }
      await loadOrgs();
    } catch (e) {
      setError(e.message);
    } finally {
      setActionSlug(null);
    }
  };

  if (loading && orgs.length === 0) {
    return <div className="sa-loading-shell"><div className="sa-loading-container"><div className="sa-loading-spinner" /></div></div>;
  }

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1>Organizations</h1>
          <p>Manage all organizations on the platform</p>
        </div>
        <button className="sa-btn sa-btn-primary" onClick={() => setShowCreate(true)}>+ New Conference</button>
      </div>

      {error && <div className="sa-error-banner">{error}</div>}

      <div className="sa-table-wrap">
        <table className="sa-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Owner Email</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Blocked</th>
              <th>Discovery</th>
              <th>Users</th>
              <th>Events</th>
              <th>Created</th>
              <th style={{ width: 220 }} />
            </tr>
          </thead>
          <tbody>
            {orgs.map(org => (
              <tr key={org.id} className={org.blocked_at ? "sa-row-blocked" : ""}>
                <td className="sa-clickable-row" onClick={() => navigate(`/system/organizations/${org.slug}`)} style={{ cursor: "pointer" }}>
                  {org.blocked_at && <span className="sa-blocked-icon" title="Blocked">&#x1f512;</span>}
                  <strong>{org.name}</strong><br /><span className="sa-muted">{org.slug}</span>
                </td>
                <td className="sa-muted" style={{ fontSize: 13 }}>{ownerEmails[org.slug] || "..."}</td>
                <td>{org.plan_name || "Free"}</td>
                <td><StatusBadge status={org.plan_status || "active"} /></td>
                <td>{org.blocked_at ? <span className="sa-badge" style={{ background: "#dc2626", color: "#fff" }}>Blocked</span> : <span className="sa-badge" style={{ background: "#0d7e52", color: "#fff" }}>Active</span>}</td>
                <td>
                  {org.discovery_enabled ? (
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                      <span className="sa-badge" style={{ background: "#0d7e52", color: "#fff" }}>Enabled</span>
                      {org.card_published ? <span className="sa-badge" style={{ background: "#2563eb", color: "#fff" }}>Published</span> : null}
                      {org.card_blocked ? <span className="sa-badge" style={{ background: "#dc2626", color: "#fff" }}>Blocked</span> : null}
                    </div>
                  ) : (
                    <span className="sa-badge" style={{ background: "#6b7280", color: "#fff" }}>Disabled</span>
                  )}
                </td>
                <td>{org.user_count}</td>
                <td>{org.event_count}</td>
                <td>{new Date(org.created_at).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      className={`sa-btn sa-btn-sm ${org.blocked_at ? "sa-btn-primary" : "sa-btn-sm-outline-warn"}`}
                      onClick={e => { e.stopPropagation(); handleBlockToggle(org); }}
                      disabled={actionSlug === org.slug}
                    >
                      {actionSlug === org.slug ? "..." : org.blocked_at ? "Unblock" : "Block"}
                    </button>
                    <button
                      className="sa-btn sa-btn-sm sa-btn-danger"
                      onClick={e => { e.stopPropagation(); handleDelete(org); }}
                      disabled={actionSlug === org.slug}
                    >
                      {actionSlug === org.slug ? "..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {orgs.length === 0 && <tr><td colSpan="10" className="sa-empty">No organizations found</td></tr>}
          </tbody>
        </table>
      </div>

      {showCreate && <CreateOrgModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
    </div>
  );
}
