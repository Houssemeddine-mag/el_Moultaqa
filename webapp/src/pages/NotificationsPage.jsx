import { useEffect, useState } from "react";
import { fetchNotifications } from "../services/localService";

const TYPE_COLOURS = {
  info:    { bg: "rgba(14,165,233,.1)",  text: "#0ea5e9" },
  warning: { bg: "rgba(245,158,11,.1)", text: "#f59e0b" },
  urgent:  { bg: "rgba(239,68,68,.1)",  text: "#ef4444" },
  session: { bg: "rgba(13,126,82,.1)",  text: "#0d7e52" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadNotifications() {
      try {
        const items = await fetchNotifications(50);
        if (mounted) {
          setNotifications(items);
        }
      } catch (err) {
        console.error("[NotificationsPage] load error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadNotifications();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="page-shell">
      <div className="card">
        <h1 className="section-title">Notifications</h1>
        <p>Live announcements and updates from the conference organizers.</p>
      </div>

      {loading ? (
        <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
          <p>Loading notifications…</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🔔</div>
          <h3 style={{ margin: "0 0 0.5rem" }}>No announcements yet</h3>
          <p style={{ color: "var(--text-muted, #888)", margin: 0 }}>
            Conference notifications and updates will appear here.
          </p>
        </div>
      ) : (
        <div className="list-grid">
          {notifications.map((item) => {
            const colours = TYPE_COLOURS[item.type] || TYPE_COLOURS.info;
            return (
              <article
                key={item.id || item.title}
                className="card"
                style={{
                  borderLeft: `4px solid ${colours.text}`,
                  background: colours.bg,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                  <div>
                    {item.isPinned && (
                      <span style={{ fontSize: ".7rem", fontWeight: 700, color: colours.text, marginBottom: "0.4rem", display: "block" }}>
                        📌 Pinned
                      </span>
                    )}
                    <h3 style={{ margin: "0 0 0.35rem" }}>{item.title}</h3>
                    <p style={{ margin: 0, fontSize: ".9rem" }}>{item.message}</p>
                  </div>
                  {item.type && item.type !== "info" && (
                    <span style={{ fontSize: ".7rem", fontWeight: 700, color: colours.text, background: "rgba(255,255,255,.12)", padding: "2px 10px", borderRadius: 20, whiteSpace: "nowrap", border: `1px solid ${colours.text}40` }}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                  )}
                </div>
                {item.createdAt && (
                  <p style={{ margin: "0.6rem 0 0", fontSize: ".75rem", opacity: .55 }}>
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

