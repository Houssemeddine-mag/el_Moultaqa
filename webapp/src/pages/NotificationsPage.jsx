export default function NotificationsPage() {
  const notifications = [
    { title: "Session update", message: "The keynote has moved to 10:00 AM." },
    {
      title: "New speaker added",
      message: "A new panelist has joined the strategy session.",
    },
  ];

  return (
    <div className="page-shell">
      <div className="card">
        <h1 className="section-title">Notifications</h1>
        <p>Live announcements and updates for attendees.</p>
      </div>
      <div className="list-grid">
        {notifications.map((item) => (
          <article key={item.title} className="card">
            <h3>{item.title}</h3>
            <p>{item.message}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
