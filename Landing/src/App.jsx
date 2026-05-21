import { useState } from "react";
import "./styles.css";
import logo from "@logo";
import icon from "@icon";

const offers = [
  {
    id: "starter",
    name: "Starter",
    price: "$499",
    description: "Landing page + basic web app + admin dashboard.",
  },
  {
    id: "growth",
    name: "Growth",
    price: "$899",
    description: "Mobile app + web portal + advanced conference tools.",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$1,499",
    description:
      "Full event suite with sponsorship, notifications, and support.",
  },
];

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

const initialConference = {
  name: "",
  shortName: "",
  themeColor: "#614F96",
  logo: "",
  startDate: "2026-12-12",
  endDate: "2026-12-14",
  collaborators: [""],
  sponsors: [""],
  offer: offers[0].id,
};

function ConferenceBuilder({ config, onChange, onBack, onFinish }) {
  const [step, setStep] = useState(1);

  const next = () => setStep((value) => Math.min(4, value + 1));
  const prev = () => setStep((value) => Math.max(1, value - 1));

  const updateField = (key, value) => {
    onChange({ ...config, [key]: value });
  };

  const addCollaborator = () =>
    onChange({
      ...config,
      collaborators: [...config.collaborators, ""],
    });

  const addSponsor = () =>
    onChange({
      ...config,
      sponsors: [...config.sponsors, ""],
    });

  const updateArrayValue = (key, index, value) => {
    const nextValues = [...config[key]];
    nextValues[index] = value;
    onChange({ ...config, [key]: nextValues });
  };

  return (
    <div className="builder-shell">
      <button className="builder-back" onClick={onBack}>
        ← Back to landing
      </button>
      <div className="builder-card">
        <header className="builder-header">
          <div>
            <p className="eyebrow">Customize your conference</p>
            <h1>Build your branded conference experience</h1>
          </div>
          <div className="builder-step-pill">Step {step} of 4</div>
        </header>

        {step === 1 && (
          <section className="builder-step">
            <h2>Choose your package</h2>
            <div className="offer-grid">
              {offers.map((offer) => (
                <button
                  key={offer.id}
                  type="button"
                  className={
                    offer.id === config.offer
                      ? "offer-card selected"
                      : "offer-card"
                  }
                  onClick={() => updateField("offer", offer.id)}
                >
                  <strong>{offer.name}</strong>
                  <span>{offer.price}</span>
                  <p>{offer.description}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="builder-step">
            <h2>Conference details</h2>
            <div className="form-grid">
              <label>
                Conference name
                <input
                  type="text"
                  value={config.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="ElMoultaqa Summit 2026"
                />
              </label>
              <label>
                Short name
                <input
                  type="text"
                  value={config.shortName}
                  onChange={(event) =>
                    updateField("shortName", event.target.value)
                  }
                  placeholder="ElMoultaqa"
                />
              </label>
              <label>
                Theme color
                <input
                  type="color"
                  value={config.themeColor}
                  onChange={(event) =>
                    updateField("themeColor", event.target.value)
                  }
                />
              </label>
              <label>
                Logo URL
                <input
                  type="text"
                  value={config.logo}
                  onChange={(event) => updateField("logo", event.target.value)}
                  placeholder="https://.../logo.png"
                />
              </label>
              <label>
                Start date
                <input
                  type="date"
                  value={config.startDate}
                  onChange={(event) =>
                    updateField("startDate", event.target.value)
                  }
                />
              </label>
              <label>
                End date
                <input
                  type="date"
                  value={config.endDate}
                  onChange={(event) =>
                    updateField("endDate", event.target.value)
                  }
                />
              </label>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="builder-step">
            <h2>Collaborators and sponsors</h2>
            <div className="form-grid">
              <div>
                <p className="field-title">Collaborators</p>
                {config.collaborators.map((collaborator, index) => (
                  <input
                    key={index}
                    type="text"
                    value={collaborator}
                    onChange={(event) =>
                      updateArrayValue(
                        "collaborators",
                        index,
                        event.target.value,
                      )
                    }
                    placeholder={`Collaborator ${index + 1}`}
                  />
                ))}
                <button
                  type="button"
                  className="link-button"
                  onClick={addCollaborator}
                >
                  + Add collaborator
                </button>
              </div>
              <div>
                <p className="field-title">Sponsors</p>
                {config.sponsors.map((sponsor, index) => (
                  <input
                    key={index}
                    type="text"
                    value={sponsor}
                    onChange={(event) =>
                      updateArrayValue("sponsors", index, event.target.value)
                    }
                    placeholder={`Sponsor ${index + 1}`}
                  />
                ))}
                <button
                  type="button"
                  className="link-button"
                  onClick={addSponsor}
                >
                  + Add sponsor
                </button>
              </div>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="builder-step">
            <h2>Review and launch</h2>
            <div className="result-card">
              <strong>{config.name || "Your conference"}</strong>
              <p>{config.shortName || "A modern event platform"}</p>
              <div className="badge" style={{ background: config.themeColor }}>
                Theme: {config.themeColor}
              </div>
              <div className="links-grid">
                <div>
                  <label>Admin panel</label>
                  <p>{`https://admin.elmoultaqa.com/${config.shortName.toLowerCase().replace(/\s+/g, "-") || "conference"}`}</p>
                </div>
                <div>
                  <label>Webapp</label>
                  <p>{`https://web.elmoultaqa.com/${config.shortName.toLowerCase().replace(/\s+/g, "-") || "conference"}`}</p>
                </div>
              </div>
              <div className="qr-placeholder">
                <div>QR CODE</div>
                <p>
                  Scan to download the mobile app or open the conference portal.
                </p>
              </div>
            </div>
          </section>
        )}

        <footer className="builder-actions">
          <div>
            {step > 1 && (
              <button type="button" className="secondary-button" onClick={prev}>
                Previous
              </button>
            )}
          </div>
          <div>
            {step < 4 ? (
              <button type="button" className="hero-button" onClick={next}>
                Continue
              </button>
            ) : (
              <button type="button" className="hero-button" onClick={onFinish}>
                Launch conference
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState("home");
  const [conference, setConference] = useState(initialConference);
  const [completed, setCompleted] = useState(false);

  return (
    <div className="landing-shell">
      <header className="landing-nav">
        <div className="brand">
          <img className="logo-image" src={icon} alt="El Moultaqa icon" />
          <div>
            <strong className="brand-title">El Moultaqa</strong>
            <span className="brand-subtitle">الملتقى</span>
          </div>
        </div>
        <button className="landing-cta" onClick={() => setMode("builder")}>
          Create your conference
        </button>
      </header>

      {mode === "home" ? (
        <main className="landing-main">
          <section className="hero-panel">
            <div className="hero-copy">
              <h1>
                Build and launch any conference experience with confidence.
              </h1>
              <p>
                ElMoultaqa gives you a unified landing page, attendee web app,
                mobile experience and admin dashboard that are easy to configure
                for every event.
              </p>
              <div className="hero-actions">
                <button
                  className="hero-button"
                  onClick={() => setMode("builder")}
                >
                  Create your conference
                </button>
                <button
                  className="secondary-button"
                  onClick={() => setMode("builder")}
                >
                  Start with a demo
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
                  A conference platform designed for Algerian digital events,
                  with powerful attendee journeys and modern admin controls.
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
                  Native mobile experiences for attendees, sessions, and
                  updates.
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
                <p>
                  Manage sessions, speakers, users, and conference settings.
                </p>
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
                  Launch your admin panel, attendee webapp, and branded mobile
                  app.
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
      ) : (
        <ConferenceBuilder
          config={conference}
          onChange={setConference}
          onBack={() => setMode("home")}
          onFinish={() => {
            setCompleted(true);
            setMode("builder");
          }}
        />
      )}

      <footer className="landing-footer">
        <p>ElMoultaqa — conference software for modern events.</p>
      </footer>
    </div>
  );
}
