import { useNavigate } from "react-router-dom";
import { conferenceConfig } from "../conferenceConfig";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page-shell home-page">
      <section className="hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">{conferenceConfig.name}</span>
          <h1>
            ElMoultaqa connects you to conference content, speakers, and live
            sessions.
          </h1>
          <p>{conferenceConfig.description}</p>
          <div className="hero-actions">
            <button
              className="primary-button"
              type="button"
              onClick={() => navigate("/program")}
            >
              Explore the program
            </button>
            <button
              className="secondary-button"
              type="button"
              onClick={() => navigate("/direct")}
            >
              Watch live
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-panel">
            <h2>Hybrid conference experience</h2>
            <p>
              ElMoultaqa helps organizers and attendees stay synced with the
              full event schedule, speaker content, and live broadcast.
            </p>
            <div className="stats-grid">
              <div className="stats-card">
                <h4>3 days</h4>
                <p>Conference duration</p>
              </div>
              <div className="stats-card">
                <h4>28 talks</h4>
                <p>Featured sessions and panels</p>
              </div>
              <div className="stats-card">
                <h4>1200+</h4>
                <p>Expected attendees</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="logo-ribbon">
        <div className="ribbon-track">
          {conferenceConfig.sponsors.map((sponsor) => (
            <div key={sponsor.label} className="ribbon-item">
              <span>{sponsor.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-card">
        <div className="section-header">
          <div>
            <span>Conference highlights</span>
            <h3>Designed for modern hybrid events</h3>
          </div>
        </div>
        <div className="section-grid">
          <div className="info-card">
            <h4>Stream the main stage</h4>
            <p>Live broadcast and session replays in one place.</p>
          </div>
          <div className="info-card">
            <h4>Track every session</h4>
            <p>Full agenda with filters for day, room, and speaker.</p>
          </div>
          <div className="info-card">
            <h4>Manage your profile</h4>
            <p>Your attendee data is accessible across web and mobile.</p>
          </div>
          <div className="info-card">
            <h4>Conference analytics</h4>
            <p>Follow event trends and engagement right from the dashboard.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
