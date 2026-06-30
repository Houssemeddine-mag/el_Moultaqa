import { useState, useEffect } from "react";
import { Users, ClipboardList, Calendar, Mic, Shield, MapPin, Building2, Podcast, Handshake, HelpCircle, Bell } from "lucide-react";
import backend from "../backend.js";

function StatCard({ title, value, description, icon: Icon, index }) {
  return (
    <div
      className="stat-card"
      style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.08}s both` }}
    >
      <div className="stat-icon"><Icon size={22} /></div>
      <h3>{title}</h3>
      <p className="stat-value">{value}</p>
      <p className="stat-subtitle">{description}</p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="stat-card" style={{ pointerEvents: "none" }}>
      <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 14, marginBottom: 16 }} />
      <div className="skeleton" style={{ width: "60%", height: 14, marginBottom: 10 }} />
      <div className="skeleton" style={{ width: "40%", height: 28, marginBottom: 8 }} />
      <div className="skeleton" style={{ width: "80%", height: 12 }} />
    </div>
  );
}

function EventBanner({ event }) {
  if (!event) return null;
  return (
    <div
      style={{
        marginBottom: 24,
        borderRadius: "var(--radius-md)",
        background: `linear-gradient(135deg, var(--primary) 0%, rgba(13, 126, 82, 0.85) 100%)`,
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-40%",
          right: "-10%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-30%",
          left: "5%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
          pointerEvents: "none",
        }}
      />
      <div style={{ padding: 24, position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 12px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.15)",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 12,
              }}
            >
              Current Event
            </div>
            <h2 style={{ margin: "0 0 6px", fontSize: "1.4rem", fontWeight: 700 }}>
              {event.title}
            </h2>
            {event.description && (
              <p style={{ margin: "0 0 12px", opacity: 0.85, fontSize: "0.88rem", lineHeight: 1.5 }}>
                {event.description}
              </p>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, fontSize: "0.85rem", opacity: 0.9 }}>
              {event.start_date && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Calendar size={14} />
                  {new Date(event.start_date).toLocaleDateString()}
                  {event.end_date && event.end_date !== event.start_date
                    ? ` — ${new Date(event.end_date).toLocaleDateString()}`
                    : ""}
                </span>
              )}
              {event.location && <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><MapPin size={14} />{event.location}</span>}
              {event.venue && <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Building2 size={14} />{event.venue}</span>}
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div
              style={{
                display: "inline-block",
                padding: "6px 14px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.2)",
                fontSize: "0.8rem",
                fontWeight: 700,
                textTransform: "capitalize",
              }}
            >
              {event.status || "draft"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [presenters, setPresenters] = useState([]);
  const [keynoteSpeakers, setKeynoteSpeakers] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");
        
        const [dashboardMetrics, topPresenters, events, ks, sp, qs, notifs] = await Promise.all([
          backend.getDashboardMetrics(),
          backend.getTopPresenters(5),
          backend.getEvents(),
          backend.getKeynoteSpeakers().catch(() => []),
          backend.getSponsors().catch(() => []),
          backend.getQuestions().catch(() => []),
          backend.getNotifications().catch(() => []),
        ]);

        setMetrics(dashboardMetrics);
        setPresenters(topPresenters);
        setKeynoteSpeakers(ks);
        setSponsors(sp);
        setQuestions(qs);
        setNotifications(notifs);
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
      <div className="page-card" style={{ animation: "fadeInUp 0.4s ease-out" }}>
        <div className="page-header">
          <div>
            <h1>ElMoultaqa Admin Dashboard</h1>
            <p className="subtitle">Overview of your organization's conference data</p>
          </div>
        </div>
        <div className="grid-cards">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-card" style={{ animation: "fadeInUp 0.4s ease-out" }}>
        <div className="page-header">
          <div>
            <h1>ElMoultaqa Admin Dashboard</h1>
            <p className="subtitle">Overview of your organization's conference data</p>
          </div>
        </div>
        <div
          style={{
            padding: 16,
            background: "rgba(239, 68, 68, 0.06)",
            color: "var(--danger)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid rgba(239, 68, 68, 0.15)",
            fontSize: "0.9rem",
            lineHeight: 1.5,
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  const metricCards = metrics
    ? [
        { title: "Total Users", value: metrics.totalUsers, description: "Registered attendees and staff", icon: Users },
        { title: "Speakers", value: metrics.usersByRole.speakers + keynoteSpeakers.length, description: "Speakers + keynotes", icon: Mic },
        { title: "Keynote Speakers", value: keynoteSpeakers.length, description: "Invited keynote speakers", icon: Podcast },
        { title: "Sessions", value: metrics.totalSessions, description: "Total program sessions", icon: ClipboardList },
        { title: "Events", value: metrics.totalEvents, description: "Conference events organized", icon: Calendar },
        { title: "Sponsors", value: sponsors.length, description: "Partner organizations", icon: Handshake },
        { title: "Unanswered Q&A", value: questions.filter((q) => !q.isAnswered).length, description: "Questions needing a reply", icon: HelpCircle },
        { title: "Notifications", value: notifications.length, description: "Broadcasts sent to attendees", icon: Bell },
      ]
    : [];

  return (
    <div className="page-card" style={{ animation: "fadeInUp 0.4s ease-out" }}>
      <div className="page-header">
        <div>
          <h1>ElMoultaqa Admin Dashboard</h1>
          <p className="subtitle">
            Overview of your organization's conference data
          </p>
        </div>
      </div>

      <EventBanner event={currentEvent} />

      <div className="grid-cards">
        {metricCards.map((metric, i) => (
          <StatCard key={metric.title} {...metric} index={i} />
        ))}
      </div>

      <div className="page-header" style={{ marginTop: 32 }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Recent Speakers</h2>
          <p className="subtitle">
            Recently added keynote speakers and presenters
          </p>
        </div>
      </div>

      {presenters.length === 0 ? (
        <div className="table-card" style={{ textAlign: "center", padding: 40 }}>
          <div style={{ marginBottom: 12, color: "var(--muted)" }}><Mic size={40} /></div>
          <h3 style={{ margin: "0 0 6px", fontSize: "1.1rem" }}>No speakers yet</h3>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>
            Speakers will appear here once you add them to your conference.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 14,
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            marginTop: 4,
          }}
        >
          {presenters.map((presenter, i) => (
            <div
              key={presenter.id}
              style={{
                animation: `fadeInUp 0.4s ease-out ${i * 0.06}s both`,
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                padding: 20,
                display: "flex",
                gap: 16,
                alignItems: "center",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  overflow: "hidden",
                  flexShrink: 0,
                  background: "rgba(13,126,82,0.1)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "1.2rem",
                }}
              >
                {presenter.photo ? (
                  <img
                    src={presenter.photo}
                    alt={presenter.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span>{presenter.name ? presenter.name.charAt(0).toUpperCase() : "?"}</span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 2 }}>{presenter.name}</div>
                <div style={{ color: "var(--muted)", fontSize: "0.82rem" }}>
                  {presenter.title || presenter.company
                    ? [presenter.title, presenter.company].filter(Boolean).join(" · ")
                    : "Speaker"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
