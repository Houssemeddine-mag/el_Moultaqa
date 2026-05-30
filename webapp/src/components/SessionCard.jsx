export default function SessionCard({ session }) {
  const time = session.time || session.start || "TBD";
  const room = session.room || session.location || "TBD";
  const speaker =
    session.speaker ||
    session.presenter ||
    session.conferences?.[0]?.presenter ||
    "TBA";
  const track = session.track || session.type || "Conference";

  return (
    <article className="session-card">
      <div className="session-meta">
        <span className="session-time">{time}</span>
        <span className="session-room">{room}</span>
      </div>
      <h3>{session.title}</h3>
      <p>{speaker}</p>
      <span className="session-track">{track}</span>
    </article>
  );
}
