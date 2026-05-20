import { conferenceConfig } from "../conferenceConfig";

export default function ProgramPage() {
  return (
    <div className="page-shell">
      <div className="section-card">
        <div className="section-header">
          <div>
            <span>Event program</span>
            <h1>Agenda for {conferenceConfig.name}</h1>
          </div>
        </div>
        <p>{conferenceConfig.description}</p>
      </div>

      <div className="program-grid">
        {conferenceConfig.schedule.map((day) => (
          <div key={day.label} className="program-item">
            <h4>
              {day.label} — {day.date}
            </h4>
            <div className="list-grid">
              {day.sessions.map((session) => (
                <div key={session.time} className="section-card">
                  <strong>{session.time}</strong>
                  <h3>{session.title}</h3>
                  <p>{session.speaker}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
