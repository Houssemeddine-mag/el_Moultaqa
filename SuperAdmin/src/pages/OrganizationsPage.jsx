import { useState, useEffect } from "react";
import { useSuperAdmin } from "../backend.js";

function CreateOrgModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !slug.trim() || !adminEmail.trim()) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      await onCreate({ name: name.trim(), slug: slug.trim(), adminEmail: adminEmail.trim() });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sa-modal-overlay" onClick={onClose}>
      <div className="sa-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sa-modal-header">
          <h2>Create Organization</h2>
          <button className="sa-modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <label>
            Organization Name
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="My Conference" />
          </label>
          <label>
            Slug (URL identifier)
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value.replace(/\s+/g, "-").toLowerCase())} placeholder="my-conference" />
          </label>
          <label>
            Admin Email
            <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="admin@example.com" />
          </label>
          {error && <p className="sa-login-error">{error}</p>}
          <div className="sa-modal-actions">
            <button type="button" className="sa-btn sa-btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="sa-btn sa-btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create Organization"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const color = status === "active" ? "#0d7e52" : status === "past_due" ? "#d97706" : "#6b7280";
  return (
    <span className="sa-badge" style={{ background: color, color: "#fff" }}>{status}</span>
  );
}

export default function OrganizationsPage() {
  const sa = useSuperAdmin();
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  async function loadOrgs() {
    try {
      setLoading(true);
      const data = await sa.listOrganizations();
      setOrgs(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadOrgs(); }, []);

  const handleCreate = async (data) => {
    await sa.createOrganization(data);
    await loadOrgs();
  };

  if (loading && orgs.length === 0) {
    return (
      <div className="sa-loading-shell">
        <div className="sa-loading-container">
          <div className="sa-loading-spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1>Organizations</h1>
          <p>Manage all organizations on the platform</p>
        </div>
        <button className="sa-btn sa-btn-primary" onClick={() => setShowCreate(true)}>
          + Create Organization
        </button>
      </div>

      {error && <div className="sa-error-banner">{error}</div>}

      <div className="sa-table-wrap">
        <table className="sa-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Users</th>
              <th>Events</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {orgs.map((org) => (
              <tr key={org.id}>
                <td>
                  <strong>{org.name}</strong>
                  <br /><span className="sa-muted">{org.slug}</span>
                </td>
                <td>{org.plan_name || "Free"}</td>
                <td><StatusBadge status={org.plan_status || "active"} /></td>
                <td>{org.user_count}</td>
                <td>{org.event_count}</td>
                <td>{new Date(org.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {orgs.length === 0 && (
              <tr><td colSpan="6" className="sa-empty">No organizations found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <CreateOrgModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
