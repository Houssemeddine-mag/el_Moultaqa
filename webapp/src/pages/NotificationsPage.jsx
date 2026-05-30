import { useEffect, useState } from "react";
import { fetchNotifications } from "../services/localService";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function loadNotifications() {
      const items = await fetchNotifications(50);
      if (mounted) {
        setNotifications(items);
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
        <p>Live announcements and updates for attendees.</p>
      </div>
      <div className="list-grid">
        {notifications.map((item) => (
          <article key={item.id || item.title} className="card">
            <h3>{item.title}</h3>
            <p>{item.message}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
