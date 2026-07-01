import { useState, useEffect } from "react";
import { useSuperAdmin } from "../backend.js";

const templates = {
  plan_exceeded: {
    label: "Plan Nearly Exceeded",
    subject: (org) => `Your ${org.name} plan is about to expire`,
    body: (org) =>
      `Hi there,\n\nThis is a friendly reminder that your "${org.name}" ${org.plan_display_name || org.plan_name || "current"} plan is approaching its limit.\n\n` +
      `Current plan: ${org.plan_display_name || org.plan_name || "Free"}\nStatus: ${org.plan_status || "active"}\n\n` +
      `To avoid any disruption to your conference, please consider upgrading your plan or adding more resources.\n\n` +
      `If you have any questions, feel free to reach out.\n\nBest regards,\nThe ElMoultaqa Team`,
  },
};

function EmailModal({ org, onClose, onSend }) {
  const [mode, setMode] = useState("template");
  const [template, setTemplate] = useState("plan_exceeded");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (mode === "template" && template) {
      const t = templates[template];
      setSubject(t.subject(org));
      setBody(t.body(org));
    }
  }, [mode, template, org]);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) return;
    setSending(true);
    try {
      await onSend({ to: org.adminEmail, subject: subject.trim(), body: body.trim() });
      setSent(true);
      setTimeout(onClose, 1200);
    } catch (e) {
      alert("Failed to send: " + e.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="sa-modal-overlay" onClick={onClose}>
      <div className="sa-modal sa-modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="sa-modal-header">
          <h2>Send Email to {org.name}</h2>
          <button className="sa-modal-close" onClick={onClose}>&times;</button>
        </div>

        <div style={{ padding: "0 28px 20px" }}>
          <div className="sa-form-row">
            <label>To
              <input type="text" value={org.adminEmail || "Loading..."} readOnly disabled />
            </label>
          </div>

          <div style={{ margin: "16px 0" }}>
            <label className="sa-checkbox-label" style={{ marginBottom: 8 }}>
              <input type="radio" checked={mode === "template"} onChange={() => setMode("template")} />
              Use a predefined template
            </label>
            {mode === "template" && (
              <div style={{ marginLeft: 24 }}>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  style={{ maxWidth: 320 }}
                >
                  {Object.entries(templates).map(([key, t]) => (
                    <option key={key} value={key}>{t.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div style={{ margin: "16px 0" }}>
            <label className="sa-checkbox-label">
              <input type="radio" checked={mode === "custom"} onChange={() => setMode("custom")} />
              Write a custom email
            </label>
          </div>

          <div className="sa-form-row">
            <label>Subject
              <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Email subject" />
            </label>
          </div>

          <div className="sa-form-row">
            <label>Message
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={10}
                style={{ resize: "vertical", fontFamily: "inherit" }}
                placeholder="Write your message here..."
              />
            </label>
          </div>
        </div>

        {sent ? (
          <div style={{ padding: "16px 28px", background: "rgba(13,126,82,0.08)", color: "var(--primary)", fontWeight: 600, fontSize: ".9rem", textAlign: "center", borderTop: "1px solid var(--border)" }}>
            Email sent successfully!
          </div>
        ) : (
          <div className="sa-modal-actions">
            <button className="sa-btn sa-btn-ghost" onClick={onClose}>Cancel</button>
            <button className="sa-btn sa-btn-primary" onClick={handleSend} disabled={sending || !subject.trim() || !body.trim()}>
              {sending ? "Sending..." : "Send Email"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const color = status === "active" ? "#0d7e52" : status === "past_due" ? "#d97706" : "#6b7280";
  return <span className="sa-badge" style={{ background: color, color: "#fff" }}>{status}</span>;
}

export default function NotifyPage() {
  const sa = useSuperAdmin();
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sending, setSending] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await sa.listOrganizations();
        setOrgs(data.map(o => ({ ...o, adminEmail: null, adminEmailLoading: true })));
        loadAdminEmails(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function loadAdminEmails(orgList) {
    const results = await Promise.allSettled(
      orgList.map(async (org) => {
        const schema = org.schema_name || org.slug;
        try {
          const users = await sa.orgQuery(schema, "users", { role: "admin" }, 1);
          const admin = users && users.length > 0 ? users[0] : null;
          return { slug: org.slug, email: admin?.email || "", loading: false };
        } catch {
          return { slug: org.slug, email: "", loading: false };
        }
      })
    );
    const emailMap = {};
    results.forEach((r) => {
      if (r.status === "fulfilled") emailMap[r.value.slug] = { email: r.value.email, loading: false };
    });
    setOrgs((prev) => prev.map((o) => ({
      ...o,
      adminEmail: emailMap[o.slug]?.email || "",
      adminEmailLoading: emailMap[o.slug]?.loading ?? false,
    })));
  }

  const handleSend = async ({ to, subject, body }) => {
    setSending(to);
    try {
      const { data, error } = await sa.supabase.functions.invoke("send-notification", {
        body: { to, subject, body },
      });
      if (error) throw error;
      if (data?.provider === "none") {
        window.open(`mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
      }
    } catch {
      window.open(`mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
    } finally {
      setSending(null);
    }
  };

  const filtered = orgs.filter((o) => {
    const matchSearch = !search || o.name.toLowerCase().includes(search.toLowerCase()) || o.slug.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || (o.plan_status || "active") === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading && orgs.length === 0) {
    return <div className="sa-loading-shell"><div className="sa-loading-container"><div className="sa-loading-spinner" /></div></div>;
  }

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1>Notify Conference Owners</h1>
          <p>View all organizations and send email notifications to their administrators.</p>
        </div>
      </div>

      {error && <div className="sa-error-banner">{error}</div>}

      <div className="sa-notify-controls">
        <input
          type="text"
          placeholder="Search by name or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ maxWidth: 180 }}>
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="past_due">Past due</option>
          <option value="canceled">Canceled</option>
        </select>
        <span className="sa-muted" style={{ fontSize: ".85rem" }}>{filtered.length} of {orgs.length} organizations</span>
      </div>

      <div className="sa-table-wrap">
        <table className="sa-table">
          <thead>
            <tr>
              <th>Organization</th>
              <th>Admin Email</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Days Left</th>
              <th>Users</th>
              <th>Events</th>
              <th>Blocked</th>
              <th style={{ width: 140 }} />
            </tr>
          </thead>
          <tbody>
            {filtered.map((org) => (
              <tr key={org.id} className={org.blocked_at ? "sa-row-blocked" : ""}>
                <td>
                  <strong>{org.name}</strong><br /><span className="sa-muted">{org.slug}</span>
                </td>
                <td>
                  {org.adminEmailLoading ? (
                    <span className="sa-muted">Loading...</span>
                  ) : org.adminEmail ? (
                    org.adminEmail
                  ) : (
                    <span className="sa-muted">Not found</span>
                  )}
                </td>
                <td>{org.plan_display_name || org.plan_name || "Free"}</td>
                <td><StatusBadge status={org.plan_status || "active"} /></td>
                <td>
                  {(() => {
                    if (!org.plan_end_date) return <span className="sa-muted">&mdash;</span>;
                    const now = new Date();
                    const end = new Date(org.plan_end_date);
                    const days = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
                    if (days < 0) return <span className="sa-badge" style={{ background: "#dc2626", color: "#fff" }}>Expired</span>;
                    if (days <= 7) return <span className="sa-badge" style={{ background: "#dc2626", color: "#fff" }}>{days}d</span>;
                    if (days <= 14) return <span className="sa-badge" style={{ background: "#d97706", color: "#fff" }}>{days}d</span>;
                    return <span className="sa-badge" style={{ background: "#0d7e52", color: "#fff" }}>{days}d</span>;
                  })()}
                </td>
                <td>{org.user_count}</td>
                <td>{org.event_count}</td>
                <td>
                  {org.blocked_at ? (
                    <span className="sa-badge" style={{ background: "#dc2626", color: "#fff" }}>Blocked</span>
                  ) : (
                    <span className="sa-muted">&mdash;</span>
                  )}
                </td>
                <td>
                  <button
                    className="sa-btn sa-btn-primary sa-btn-sm"
                    disabled={!org.adminEmail || sending === org.adminEmail}
                    onClick={() => setSelectedOrg(org)}
                  >
                    {sending === org.adminEmail ? "..." : "Send Email"}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="8" className="sa-empty">No organizations found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedOrg && (
        <EmailModal
          org={selectedOrg}
          onClose={() => setSelectedOrg(null)}
          onSend={handleSend}
        />
      )}
    </div>
  );
}
