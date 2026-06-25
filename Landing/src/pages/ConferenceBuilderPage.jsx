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
  onReset,
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

  if (config.id) {
    return (
      <div className="builder-shell success">
        <div className="success-card">
          <div className="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <h1>Your Conference is Live</h1>
          <p>Organization created and database schema provisioned. Ready for attendees.</p>

          {(() => {
            const webappUrl = import.meta.env.VITE_WEBAPP_URL || "http://localhost:5174";
            const adminUrl = import.meta.env.VITE_ADMIN_URL || "http://localhost:5175";
            const slug = config.slug || config.id || "conference";

            return (
              <div className="success-links">
                <div className="success-link-card">
                  <h3>Attendee Web App</h3>
                  <p>Schedules, speakers, live streaming</p>
                  <a href={`${webappUrl}/c/${slug}`} target="_blank" rel="noreferrer">
                    {webappUrl}/c/{slug}
                  </a>
                </div>

                <div className="success-link-card">
                  <h3>Admin Portal</h3>
                  <p>Events, speakers, sessions, tickets</p>
                  <a href={`${adminUrl}/c/${slug}/admin`} target="_blank" rel="noreferrer">
                    {adminUrl}/c/{slug}/admin
                  </a>
                </div>
              </div>
            );
          })()}

          <button onClick={onReset} className="hero-button">
            Build Another
          </button>
        </div>
      </div>
    );
  }

  const rawSlug = config.slug || config.id || config.shortName || config.name || "";
  const orgSlug = rawSlug
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "") || "conference";

  const attendeeUrl = `https://web.elmoultaqa.com/c/${orgSlug}`;
  const adminUrl = `https://admin.elmoultaqa.com/c/${orgSlug}/admin`;
  const attendeeLocalUrl = `http://localhost:5174/c/${orgSlug}`;
  const adminLocalUrl = `http://localhost:5175/c/${orgSlug}/admin`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(attendeeUrl)}`;

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
            
            <div style={{ marginTop: "2rem", borderTop: "1px solid rgba(255, 255, 255, 0.1)", paddingTop: "1.5rem" }}>
              <p className="field-title" style={{ marginBottom: "0.75rem" }}>Registration Mode</p>
              <div style={{ display: "flex", gap: "2rem", marginBottom: "1rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.95rem" }}>
                  <input
                    type="radio"
                    name="registrationMode"
                    value="public"
                    checked={config.registrationMode !== "private"}
                    onChange={() => {
                      // Batch both fields in one call to avoid stale-closure overwrite
                      onChange({ ...config, registrationMode: "public", registrationCode: "" });
                    }}
                  />
                  Public (anyone with the link can register and join)
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.95rem" }}>
                  <input
                    type="radio"
                    name="registrationMode"
                    value="private"
                    checked={config.registrationMode === "private"}
                    onChange={() => {
                      // Generate code and batch both fields in one call
                      const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
                      const genPart = () => Array.from({ length: 3 }, () => characters[Math.floor(Math.random() * characters.length)]).join("");
                      const code = `${genPart()}-${genPart()}`;
                      onChange({ ...config, registrationMode: "private", registrationCode: code });
                    }}
                  />
                  Private (code required to register)
                </label>
              </div>

              {config.registrationMode === "private" && (
                <label style={{ display: "block", marginTop: "1rem" }}>
                  Registration Code
                  <input
                    type="text"
                    value={config.registrationCode || ""}
                    onChange={(event) => updateField("registrationCode", event.target.value.toUpperCase())}
                    placeholder="e.g. XK7-M9Q"
                    style={{ textTransform: "uppercase", marginTop: "0.5rem" }}
                  />
                  <small style={{ color: "rgba(255,255,255,0.5)", marginTop: "0.25rem", display: "block" }}>
                    Share this code separately with your attendees.
                  </small>
                </label>
              )}
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="builder-step">
            <h2>Review and launch</h2>
            <div className="result-card">
              <strong>{config.name || "Your conference"}</strong>
              <p>{config.shortName || "A modern event platform"}</p>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem", marginBottom: "1rem" }}>
                <div className="badge" style={{ background: config.themeColor }}>
                  Theme: {config.themeColor}
                </div>
                <div className="badge" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
                  Access: {config.registrationMode === "private" ? `Private (Code: ${config.registrationCode})` : "Public"}
                </div>
              </div>

              <div className="links-grid">
                <div>
                  <label>Admin panel</label>
                  <p>{adminUrl}</p>
                  <p className="local-link">{adminLocalUrl}</p>
                </div>
                <div>
                  <label>Webapp</label>
                  <p>{attendeeUrl}</p>
                  <p className="local-link">{attendeeLocalUrl}</p>
                </div>
              </div>
              <div className="qr-card">
                <img
                  className="qr-image"
                  src={qrUrl}
                  alt={`QR code for ${attendeeUrl}`}
                />
                <p>
                  Scan this QR code to open the attendee app for your organization.
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
