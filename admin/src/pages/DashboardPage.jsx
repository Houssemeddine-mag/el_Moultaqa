import { useState, useEffect } from "react";
import backend from "../backend.js";

const DashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [presenters, setPresenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");
        
        const [dashboardMetrics, topPresenters, events] = await Promise.all([
          backend.getDashboardMetrics(),
          backend.getTopPresenters(5),
          backend.getEvents(),
        ]);

        setMetrics(dashboardMetrics);
        setPresenters(topPresenters);
        // Show the first event as the "current" event
        if (events && events.length > 0) {
          setCurrentEvent(events[0]);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard metrics. " + (err.message || ""));
        setMetrics(null);
        setPresenters([]);
        setCurrentEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="page-card">
        <div className="page-header">
          <h1>ElMoultaqa Admin Dashboard</h1>
        </div>
        <div style={{ padding: "20px", textAlign: "center" }}>
          Loading dashboard metrics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-card">
        <div className="page-header">
          <h1>ElMoultaqa Admin Dashboard</h1>
        </div>
        <div
          style={{
            padding: "12px",
            backgroundColor: "#fee",
            color: "#c33",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  const metricCards = metrics
    ? [
        {
          title: "Total Users",
          value: metrics.totalUsers,
          description: "Registered attendees and staff",
        },
        {
          title: "Total Sessions",
          value: metrics.totalSessions,
          description: "All scheduled sessions",
        },
        {
          title: "Upcoming Sessions",
          value: metrics.upcomingSessions,
          description: "Sessions yet to occur",
        },
        {
          title: "Total Events",
          value: metrics.totalEvents,
          description: "Organized events",
        },
        {
          title: "Speakers",
          value: metrics.usersByRole.speakers,
          description: "Registered speakers",
        },
        {
          title: "Admins",
          value: metrics.usersByRole.admins,
          description: "Event administrators",
        },
      ]
    : [];

  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h1>ElMoultaqa Admin Dashboard</h1>
          <p className="subtitle">
            Overview of your organization's conference data
          </p>
        </div>
      </div>

      {currentEvent && (
        <div
          style={{
            marginBottom: "24px",
            padding: "16px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, var(--accent, #0d7e52) 0%, rgba(13, 126, 82, 0.8) 100%)",
            color: "#fff",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", alignItems: "center" }}>
            <div>
              <h2 style={{ margin: "0 0 8px 0", fontSize: "1.5rem" }}>{currentEvent.title}</h2>
              {currentEvent.description && (
                <p style={{ margin: "0 0 12px 0", opacity: 0.9, fontSize: "0.95rem" }}>
                  {currentEvent.description}
                </p>
              )}
              <div style={{ display: "flex", gap: "16px", fontSize: "0.9rem" }}>
                {currentEvent.start_date && (
                  <div>
                    <strong>📅 Dates:</strong> {new Date(currentEvent.start_date).toLocaleDateString()}
                    {currentEvent.end_date && currentEvent.end_date !== currentEvent.start_date
                      ? ` - ${new Date(currentEvent.end_date).toLocaleDateString()}`
                      : ""}
                  </div>
                )}
                {currentEvent.location && (
                  <div>
                    <strong>📍 Location:</strong> {currentEvent.location}
                  </div>
                )}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  display: "inline-block",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  background: "rgba(255, 255, 255, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  marginBottom: "12px",
                }}
              >
                <strong style={{ textTransform: "capitalize" }}>{currentEvent.status || "draft"}</strong>
              </div>
              {currentEvent.venue && (
                <div style={{ fontSize: "0.9rem", opacity: 0.95 }}>
                  <strong>Venue:</strong> {currentEvent.venue}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid-cards">
        {metricCards.map((metric) => (
          <div className="stat-card" key={metric.title}>
            <h3>{metric.title}</h3>
            <p className="stat-value">{metric.value}</p>
            <p className="stat-subtitle">{metric.description}</p>
          </div>
        ))}
      </div>

      <div className="page-header" style={{ marginTop: "36px" }}>
        <div>
          <h2>Recent Speakers</h2>
          <p className="subtitle">
            Recently added keynote speakers and presenters
          </p>
        </div>
      </div>

      <div className="table-card">
        {presenters.length === 0 ? (
          <div className="empty-state">
            <h3>No speakers yet</h3>
            <p className="subtitle">
              Speakers will appear here once you add them to your conference.
            </p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Title</th>
                <th>Company</th>
                <th>Photo</th>
              </tr>
            </thead>
            <tbody>
              {presenters.map((presenter) => (
                <tr key={presenter.id}>
                  <td>{presenter.name}</td>
                  <td>{presenter.title || "—"}</td>
                  <td>{presenter.company || "—"}</td>
                  <td>
                    {presenter.photo ? (
                      <img
                        src={presenter.photo}
                        alt={presenter.name}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
