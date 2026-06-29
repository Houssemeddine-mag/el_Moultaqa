import { useState, useEffect } from "react";
import { useSuperAdmin } from "../backend.js";

function formatCents(cents) {
  if (!cents || cents === 0) return "0 DZD";
  return (cents / 100).toLocaleString() + " DZD";
}

function Donut({ data, size = 160, colors = ["#0d7e52","#2563eb","#7c3aed","#d97706","#dc2626","#0891b2","#6b7280"] }) {
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  let cumulative = 0;
  const slices = data.map((d, i) => {
    const pct = d.count / total;
    const startAngle = (cumulative / total) * 360;
    cumulative += d.count;
    const endAngle = (cumulative / total) * 360;
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;
    const r = size / 2 - 16;
    const cx = size / 2, cy = size / 2;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const large = endAngle - startAngle > 180 ? 1 : 0;
    if (d.count === 0) return null;
    return (
      <path key={i} d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`} fill={colors[i % colors.length]} stroke="#fff" strokeWidth="2" />
    );
  }).filter(Boolean);

  return (
    <div className="sa-chart-donut">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices}
        <circle cx={size / 2} cy={size / 2} r={size / 4} fill="#fff" />
        <text x={size / 2} y={size / 2 - 4} textAnchor="middle" fontSize="18" fontWeight="800" fill="#0d462f">{total}</text>
        <text x={size / 2} y={size / 2 + 14} textAnchor="middle" fontSize="10" fill="#3c5446">total</text>
      </svg>
      <div className="sa-chart-legend">
        {data.map((d, i) => d.count > 0 && (
          <div key={i} className="sa-chart-legend-item">
            <span style={{ background: colors[i % colors.length] }} />
            <span>{d.name}</span>
            <span className="sa-chart-legend-count">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChart({ data, barColor = "#0d7e52", height = 180, valueKey = "count", labelKey = "month" }) {
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  const w = Math.max(40, Math.min(60, 480 / data.length));
  return (
    <div className="sa-chart-bar" style={{ height }}>
      <div className="sa-chart-bar-inner">
        {data.map((d, i) => (
          <div key={i} className="sa-chart-bar-col" style={{ width: w }}>
            <div className="sa-chart-bar-value">{d[valueKey]}</div>
            <div className="sa-chart-bar-fill" style={{ height: `${(d[valueKey] / max) * 100}%`, background: barColor }} />
            <div className="sa-chart-bar-label">{d[labelKey]?.slice(-2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HBarChart({ data, barColor = "#0d7e52", valueKey = "users", labelKey = "name" }) {
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  return (
    <div className="sa-chart-hbar">
      {data.map((d, i) => (
        <div key={i} className="sa-chart-hbar-row">
          <div className="sa-chart-hbar-label">{d[labelKey]}</div>
          <div className="sa-chart-hbar-track">
            <div className="sa-chart-hbar-fill" style={{ width: `${(d[valueKey] / max) * 100}%`, background: barColor }} />
            <span className="sa-chart-hbar-count">{d[valueKey]}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const sa = useSuperAdmin();
  const [stats, setStats] = useState(null);
  const [detailed, setDetailed] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [s, d, o] = await Promise.all([
          sa.getStats(),
          sa.getDetailedStats().catch(() => null),
          sa.listOrganizations(),
        ]);
        const c = await sa.getChartData(o);
        setStats(s);
        setDetailed(d);
        setChartData(c);
        setOrgs(o.slice(0, 5));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="sa-loading-shell"><div className="sa-loading-container"><div className="sa-loading-spinner" /></div></div>;
  if (error) return <div className="sa-error-banner">{error}</div>;

  const d = detailed || {};
  const topCards = [
    { label: "Organizations", value: d.total_orgs ?? stats?.total_orgs, color: "#0d7e52" },
    { label: "Total Users", value: d.total_users ?? stats?.total_users, color: "#2563eb" },
    { label: "Total Events", value: d.total_events ?? stats?.total_events, color: "#7c3aed" },
    { label: "Total Sessions", value: d.total_sessions ?? stats?.total_sessions, color: "#d97706" },
    { label: "Active Orgs", value: d.active_orgs ?? stats?.active_orgs, color: "#0891b2" },
    { label: "MRR", value: formatCents(d.mrr_cents), color: "#be123c" },
  ];

  const healthCards = [
    { label: "Blocked Orgs", value: d.blocked_orgs, color: "#dc2626" },
    { label: "Past Due", value: d.past_due_orgs, color: "#d97706" },
    { label: "Orgs w/o Events", value: d.orgs_without_events, color: "#6b7280" },
  ];

  const discoveryCards = [
    { label: "Discovery Enabled", value: d.discovery_enabled, color: "#0d7e52" },
    { label: "Discovery Published", value: d.discovery_published, color: "#2563eb" },
    { label: "Discovery Blocked", value: d.discovery_blocked, color: "#dc2626" },
  ];

  const engagementCards = [
    { label: "Speakers", value: d.total_speakers, color: "#7c3aed" },
    { label: "Questions Asked", value: d.total_questions, color: "#0891b2" },
    { label: "Notifications", value: d.total_notifications, color: "#d97706" },
    { label: "Sponsors", value: d.total_sponsors, color: "#0d7e52" },
    { label: "Tickets Sold", value: d.total_tickets, color: "#dc2626" },
  ];

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Platform overview and key business metrics</p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "12px 20px", textAlign: "center" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: d.new_orgs_this_month > d.new_orgs_last_month ? "var(--primary)" : "#dc2626" }}>
              {d.new_orgs_this_month ?? "—"}
            </div>
            <div style={{ fontSize: ".75rem", color: "var(--muted)" }}>New Orgs This Month</div>
            <div style={{ fontSize: ".7rem", color: "var(--muted)", marginTop: 2 }}>
              vs {d.new_orgs_last_month ?? 0} last month
            </div>
          </div>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "12px 20px", textAlign: "center" }}>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--primary)" }}>
              {d.total_revenue_cents ? formatCents(d.total_revenue_cents) : "—"}
            </div>
            <div style={{ fontSize: ".75rem", color: "var(--muted)" }}>Total Revenue (active)</div>
          </div>
        </div>
      </div>

      {/* Top-level KPI cards */}
      <div className="sa-stats-grid">
        {topCards.map(c => (
          <div key={c.label} className="sa-stat-card" style={{ borderTop: `3px solid ${c.color}` }}>
            <div className="sa-stat-value">{c.value ?? "—"}</div>
            <div className="sa-stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Org Health row */}
      <div style={{ marginTop: 32, marginBottom: 8 }}>
        <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>Organization Health</h2>
      </div>
      <div className="sa-stats-grid">
        {healthCards.map(c => (
          <div key={c.label} className="sa-stat-card" style={{ borderTop: `3px solid ${c.color}` }}>
            <div className="sa-stat-value">{c.value ?? "—"}</div>
            <div className="sa-stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Discovery Pipeline row */}
      <div style={{ marginTop: 32, marginBottom: 8 }}>
        <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>Discovery Pipeline</h2>
      </div>
      <div className="sa-stats-grid">
        {discoveryCards.map(c => (
          <div key={c.label} className="sa-stat-card" style={{ borderTop: `3px solid ${c.color}` }}>
            <div className="sa-stat-value">{c.value ?? "—"}</div>
            <div className="sa-stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Engagement row */}
      <div style={{ marginTop: 32, marginBottom: 8 }}>
        <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>Platform Engagement</h2>
      </div>
      <div className="sa-stats-grid">
        {engagementCards.map(c => (
          <div key={c.label} className="sa-stat-card" style={{ borderTop: `3px solid ${c.color}` }}>
            <div className="sa-stat-value">{c.value ?? "—"}</div>
            <div className="sa-stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="sa-charts-grid" style={{ marginTop: 32 }}>
        {chartData?.plan_distribution?.length > 0 && (
          <div className="sa-chart-card">
            <h3>Plan Distribution</h3>
            <Donut data={chartData.plan_distribution} colors={["#0d7e52","#2563eb","#7c3aed","#d97706","#dc2626"]} />
          </div>
        )}
        {chartData?.registration_modes?.length > 0 && (
          <div className="sa-chart-card">
            <h3>Registration Modes</h3>
            <Donut data={chartData.registration_modes} colors={["#0d7e52","#d97706","#6b7280"]} />
          </div>
        )}
        {chartData?.org_growth?.length > 0 && (
          <div className="sa-chart-card sa-chart-card-wide">
            <h3>Org Growth (12 months)</h3>
            <BarChart data={chartData.org_growth} />
          </div>
        )}
        {chartData?.top_orgs?.length > 0 && (
          <div className="sa-chart-card sa-chart-card-wide">
            <h3>Top Orgs by Users</h3>
            <HBarChart data={chartData.top_orgs} />
          </div>
        )}
      </div>

      {/* Recent Orgs table */}
      <div className="sa-section" style={{ marginTop: 32 }}>
        <h2>Recent Organizations</h2>
        <div className="sa-table-wrap">
          <table className="sa-table">
            <thead>
              <tr>
                <th>Name</th><th>Plan</th><th>Users</th><th>Events</th><th>Created</th>
              </tr>
            </thead>
            <tbody>
              {orgs.map(org => (
                <tr key={org.id}>
                  <td><strong>{org.name}</strong><br /><span className="sa-muted">{org.slug}</span></td>
                  <td>{org.plan_name || "—"}</td><td>{org.user_count}</td><td>{org.event_count}</td>
                  <td>{new Date(org.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {orgs.length === 0 && <tr><td colSpan="5" className="sa-empty">No organizations yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
