export default function EventManagerPage() {
  const events = [
    { title: "Launch Workshop", status: "Ready" },
    { title: "Networking Meetup", status: "Draft" },
    { title: "VIP Roundtable", status: "Published" },
  ];

  return (
    <div className="page-card">
      <div className="page-header">
        <h1>Events</h1>
      </div>
      <div className="grid-cards">
        {events.map((event) => (
          <div className="card-block" key={event.title}>
            <h3>{event.title}</h3>
            <p>Status: {event.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
