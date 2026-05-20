import "./styles.css";

export default function App() {
  return (
    <div className="landing-shell">
      <header className="landing-nav">
        <div className="landing-logo">ElMoultaqa</div>
        <button className="landing-cta">Get Started</button>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <div className="hero-copy">
            <span>Modern conference SaaS</span>
            <h1>Build and launch any conference experience with confidence.</h1>
            <p>
              ElMoultaqa gives you a unified landing page, attendee web app,
              mobile experience and admin dashboard that are easy to configure
              for every event.
            </p>
            <button className="hero-button">Create your conference</button>
          </div>
          <div className="hero-visual" />
        </section>

        <section className="landing-features">
          <h2>What you get</h2>
          <div className="feature-grid">
            <article>
              <h3>Mobile app</h3>
              <p>
                Native mobile experiences for attendees, sessions, and updates.
              </p>
            </article>
            <article>
              <h3>Web app</h3>
              <p>
                Responsive attendee portal for schedules, speakers and live
                streams.
              </p>
            </article>
            <article>
              <h3>Admin panel</h3>
              <p>Manage sessions, speakers, users, and conference settings.</p>
            </article>
          </div>
        </section>

        <section className="landing-steps">
          <h2>How it works</h2>
          <div className="steps-grid">
            <div>
              <strong>1. Create account</strong>
              <p>Set up your conference workspace and brand settings.</p>
            </div>
            <div>
              <strong>2. Customize</strong>
              <p>
                Configure conference dates, speakers, schedule, and branding.
              </p>
            </div>
            <div>
              <strong>3. Go live</strong>
              <p>
                Launch the attendee portal, mobile app, and admin dashboard.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>ElMoultaqa — conference software for modern events.</p>
      </footer>
    </div>
  );
}
