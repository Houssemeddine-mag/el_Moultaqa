import { useState } from "react";

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

export default function ConferenceBuilderPage({
  config,
  onChange,
  onBack,
  onFinish,
  saveError,
  saving,
}) {
  const [step, setStep] = useState(1);

  const next = () => setStep((value) => Math.min(4, value + 1));
  const prev = () => setStep((value) => Math.max(1, value - 1));

  const updateField = (key, value) => {
    onChange({ ...config, [key]: value });
  };

  const addArrayItem = (key) =>
    onChange({
      ...config,
      [key]: [...config[key], ""],
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
            <h2>Invite attendees and sponsors</h2>
            <div className="form-grid">
              <div>
                <p className="field-title">Attendee emails</p>
                {config.attendees.map((attendee, index) => (
                  <input
                    key={index}
                    type="email"
                    value={attendee}
                    onChange={(event) =>
                      updateArrayValue("attendees", index, event.target.value)
                    }
                    placeholder={`Attendee email ${index + 1}`}
                  />
                ))}
                <button
                  type="button"
                  className="link-button"
                  onClick={() => addArrayItem("attendees")}
                >
                  + Add attendee
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
                  onClick={() => addArrayItem("sponsors")}
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
                  <p>{`https://admin.elmoultaqa.com/${
                    config.shortName.toLowerCase().replace(/\s+/g, "-") ||
                    "conference"
                  }`}</p>
                </div>
                <div>
                  <label>Webapp</label>
                  <p>{`https://web.elmoultaqa.com/${
                    config.shortName.toLowerCase().replace(/\s+/g, "-") ||
                    "conference"
                  }`}</p>
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

        {saveError && <div className="auth-error">{saveError}</div>}

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
              <button
                type="button"
                className="hero-button"
                onClick={onFinish}
                disabled={saving}
              >
                {saving ? "Launching..." : "Launch conference"}
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
