import logo from "@logo";

const feedbacks = [
  {
    quote: "ElMoultaqa helped us launch our hybrid event in a single week.",
    author: "Sana, Event Director",
  },
  {
    quote: "The mobile and web apps were ready to use immediately.",
    author: "Karim, Conference Producer",
  },
  {
    quote: "Sponsors loved the branded experience and live updates.",
    author: "Nadia, Head of Partnerships",
  },
];

export default function HomePage({ user, onCreate, onAuth }) {
  return (
    <main className="landing-main">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Conference software in one place</p>
          <h1>Build and launch any conference experience with confidence.</h1>
          <p>
            ElMoultaqa gives you a unified landing page, attendee web app,
            mobile experience and admin dashboard that are easy to configure for
            every event.
          </p>
          <div className="hero-actions">
            <button className="hero-button" onClick={user ? onCreate : onAuth}>
              {user ? "Create your conference" : "Sign in to create"}
            </button>
            <button
              className="secondary-button"
              onClick={user ? onCreate : onAuth}
            >
              {user ? "Start with a demo" : "Try the landing"}
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <img className="hero-logo" src={logo} alt="El Moultaqa logo" />
            <h2>
              Organize sessions, speakers, and mobile access in one place.
            </h2>
            <p>
              A conference platform designed for Algerian digital events, with
              powerful attendee journeys and modern admin controls.
            </p>
            <div className="hero-stats-grid">
              <div>
                <strong>24/7</strong>
                <p>Event operations coverage</p>
              </div>
              <div>
                <strong>3 apps</strong>
                <p>Web, mobile, and admin experiences</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-panel">
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
            <strong>1. Create your conference</strong>
            <p>Choose a package and define your conference brand.</p>
          </div>
          <div>
            <strong>2. Customize everything</strong>
            <p>Set dates, theme, sponsors, collaborators, and logos.</p>
          </div>
          <div>
            <strong>3. Go live</strong>
            <p>
              Launch your admin panel, attendee webapp, and branded mobile app.
            </p>
          </div>
        </div>
      </section>

      <section className="feedback-panel">
        <h2>Trusted by conference organizers</h2>
        <div className="feedback-grid">
          {feedbacks.map((item) => (
            <article key={item.author}>
              <p>“{item.quote}”</p>
              <strong>{item.author}</strong>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
