import { useState, useEffect } from "react";
import * as api from "../backend.js";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [statsData, orgsData] = await Promise.all([
          api.getStats(),
          api.listOrganizations(),
        ]);
        setStats(statsData);
        setOrgs(orgsData.slice(0, 5));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="sa-loading-shell">
        <div className="sa-loading-container">
          <div className="sa-loading-spinner" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="sa-error-banner">{error}</div>;
  }

  const statCards = stats ? [
    { label: "Total Organizations", value: stats.total_orgs, color: "#0d7e52" },
    { label: "Total Users", value: stats.total_users, color: "#2563eb" },
    { label: "Total Events", value: stats.total_events, color: "#7c3aed" },
    { label: "Total Sessions", value: stats.total_sessions, color: "#d97706" },
  ] : [];

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <h1>Dashboard</h1>
        <p>Platform overview and key metrics</p>
      </div>

      <div className="sa-stats-grid">
        {statCards.map((card) => (
          <div key={card.label} className="sa-stat-card" style={{ borderTop: `3px solid ${card.color}` }}>
            <div className="sa-stat-value">{card.value}</div>
            <div className="sa-stat-label">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="sa-section">
        <h2>Recent Organizations</h2>
        <div className="sa-table-wrap">
          <table className="sa-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Plan</th>
                <th>Users</th>
                <th>Events</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {orgs.map((org) => (
                <tr key={org.id}>
                  <td><strong>{org.name}</strong><br /><span className="sa-muted">{org.slug}</span></td>
                  <td>{org.plan_name || "—"}</td>
                  <td>{org.user_count}</td>
                  <td>{org.event_count}</td>
                  <td>{new Date(org.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {orgs.length === 0 && (
                <tr><td colSpan="5" className="sa-empty">No organizations yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
