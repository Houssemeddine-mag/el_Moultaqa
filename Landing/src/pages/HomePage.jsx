import logo from "@logo";

const MobileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
    <line x1="12" y1="18" x2="12.01" y2="18"></line>
  </svg>
);

const WebIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m2.12 5.08l4.24 4.24M1 12h6m6 0h6m-15.78 7.78l4.24-4.24m5.08-2.12l4.24-4.24"></path>
  </svg>
);

const PaletteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="13.5" cy="6.5" r="1.5"></circle>
    <circle cx="17.5" cy="10.5" r="1.5"></circle>
    <circle cx="17.5" cy="14.5" r="1.5"></circle>
    <circle cx="13.5" cy="18.5" r="1.5"></circle>
    <circle cx="6.5" cy="18.5" r="1.5"></circle>
    <circle cx="6.5" cy="14.5" r="1.5"></circle>
    <circle cx="6.5" cy="10.5" r="1.5"></circle>
    <circle cx="6.5" cy="6.5" r="1.5"></circle>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path>
  </svg>
);

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
        <div className="section-header">
          <h2>What you get</h2>
          <p>Everything needed to run world-class conferences</p>
        </div>
        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon">
              <MobileIcon />
            </div>
            <h3>Mobile app</h3>
            <p>
              Native-quality mobile experiences. Attendees get real-time schedules, speaker bios, session navigation, and instant notifications—no app store needed.
            </p>
            <ul className="feature-list">
              <li>Offline schedule access</li>
              <li>Push notifications</li>
              <li>Easy navigation</li>
            </ul>
          </article>
          <article className="feature-card">
            <div className="feature-icon">
              <WebIcon />
            </div>
            <h3>Web app</h3>
            <p>
              Responsive attendee portal that works on any device. Streamlined access to all conference information with live updates and seamless registration.
            </p>
            <ul className="feature-list">
              <li>Live streaming ready</li>
              <li>Real-time updates</li>
              <li>Mobile responsive</li>
            </ul>
          </article>
          <article className="feature-card">
            <div className="feature-icon">
              <SettingsIcon />
            </div>
            <h3>Admin panel</h3>
            <p>
              Complete control center. Manage every aspect of your conference from one intuitive dashboard—sessions, speakers, attendees, and analytics.
            </p>
            <ul className="feature-list">
              <li>Real-time analytics</li>
              <li>User management</li>
              <li>Event customization</li>
            </ul>
          </article>
          <article className="feature-card">
            <div className="feature-icon">
              <PaletteIcon />
            </div>
            <h3>White-label branding</h3>
            <p>
              Your logo, your colors, your brand. Fully customizable theme system that lets you create a cohesive experience across all platforms.
            </p>
            <ul className="feature-list">
              <li>Custom color schemes</li>
              <li>Logo integration</li>
              <li>Custom domain support</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="landing-steps">
        <div className="section-header">
          <h2>How it works</h2>
          <p>Three simple steps to launch your conference</p>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <strong>Create your conference</strong>
            <p>Choose your package, set your event name, and pick your brand colors. Takes just 2 minutes.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <strong>Customize everything</strong>
            <p>Add speakers, sessions, dates, sponsors, and collaborators. All editable anytime before or during your event.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <strong>Go live instantly</strong>
            <p>Your branded web app, mobile experience, and admin panel launch immediately. Share the link with attendees.</p>
          </div>
        </div>
      </section>

      <section className="feedback-panel">
        <div className="section-header">
          <h2>Trusted by conference organizers</h2>
          <p>Real feedback from event professionals who have launched with us</p>
        </div>
        <div className="feedback-grid">
          {feedbacks.map((item) => (
            <article key={item.author} className="feedback-card">
              <div className="feedback-stars">★★★★★</div>
              <p>"{item.quote}"</p>
              <strong>{item.author}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-panel">
        <h2>Ready to launch your conference?</h2>
        <p>Join event organizers creating incredible experiences with ElMoultaqa</p>
        <button className="hero-button" onClick={user ? onCreate : onAuth}>
          {user ? "Create your conference now" : "Get started free"}
        </button>
      </section>
    </main>
  );
}
