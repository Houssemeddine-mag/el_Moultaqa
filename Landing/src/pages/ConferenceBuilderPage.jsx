import { useState, useEffect } from "react";
import { useClerkSupabase } from "@global/supabase";
import { listPlans } from "../backend.js";

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
  const [logoMode, setLogoMode] = useState(
    config.logo && config.logo.startsWith("data:image/") ? "upload" : "url"
  );
  const [logoPreview, setLogoPreview] = useState(
    config.logo && config.logo.startsWith("data:image/") ? config.logo : ""
  );
  const [stepErrors, setStepErrors] = useState({});

  const supabase = useClerkSupabase();
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchPlans() {
      try {
        setPlansLoading(true);
        const data = await listPlans(supabase);
        if (cancelled) return;
        setPlans(data);
        if (data.length > 0 && !data.some((p) => p.name === config.offer)) {
          onChange({ ...config, offer: data[0].name });
        }
      } catch (err) {
        if (cancelled) return;
        console.error("[ConferenceBuilder] Failed to load plans:", err);
        setPlansError("Could not load pricing plans.");
      } finally {
        if (!cancelled) setPlansLoading(false);
      }
    }
    fetchPlans();
    return () => { cancelled = true; };
  }, []);

  const next = () => {
    if (step === 2) {
      const errors = {};
      if (!config.name?.trim()) errors.name = "Conference name is required";
      if (!config.shortName?.trim()) errors.shortName = "Short name is required";
      if (!config.startDate?.trim()) errors.startDate = "Start date is required";
      if (!config.endDate?.trim()) errors.endDate = "End date is required";
      setStepErrors(errors);
      if (Object.keys(errors).length > 0) return;
    }
    setStep((value) => Math.min(4, value + 1));
  };
  const prev = () => setStep((value) => Math.max(1, value - 1));

  const updateField = (key, value) => {
    if (stepErrors[key]) setStepErrors((prev) => ({ ...prev, [key]: "" }));
    onChange({ ...config, [key]: value });
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
            {plansLoading && <p className="offer-status">Loading plans…</p>}
            {plansError && <p className="auth-error">{plansError}</p>}
            {!plansLoading && plans.length === 0 && (
              <p className="offer-status">No plans available.</p>
            )}
            <div className="offer-grid">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  className={
                    plan.name === config.offer
                      ? "offer-card selected"
                      : "offer-card"
                  }
                  onClick={() => updateField("offer", plan.name)}
                >
                  <div className="offer-name">{plan.display_name}</div>
                  <div className="offer-price">
                    {plan.price_cents === 0
                      ? "Free"
                      : `${(plan.price_cents / 100).toLocaleString()} ${plan.currency}`}
                  </div>
                  <div className="offer-limits">
                    <span>{plan.max_events === -1 ? "∞" : plan.max_events} events</span>
                    <span>{plan.max_speakers === -1 ? "∞" : plan.max_speakers} speakers</span>
                    <span>{plan.max_sessions === -1 ? "∞" : plan.max_sessions} sessions</span>
                  </div>
                  {plan.features && (
                    <ul className="offer-features">
                      {Object.entries(plan.features)
                        .filter(([, v]) => v)
                        .map(([key]) => (
                          <li key={key}>
                            {key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                          </li>
                        ))}
                    </ul>
                  )}
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
                  className={stepErrors.name ? "input-error" : ""}
                />
                {stepErrors.name && <span className="field-error">{stepErrors.name}</span>}
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
                  className={stepErrors.shortName ? "input-error" : ""}
                />
                {stepErrors.shortName && <span className="field-error">{stepErrors.shortName}</span>}
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
              <label style={{ gridColumn: "1 / -1" }}>
                Logo
                <div className="logo-options">
                  <label className="logo-radio">
                    <input type="radio" name="logoMode" value="url"
                      checked={logoMode === "url"}
                      onChange={() => setLogoMode("url")} />
                    URL Link
                  </label>
                  <label className="logo-radio">
                    <input type="radio" name="logoMode" value="upload"
                      checked={logoMode === "upload"}
                      onChange={() => setLogoMode("upload")} />
                    Local Upload
                  </label>
                </div>
                {logoMode === "url" ? (
                  <input type="text" value={config.logo}
                    onChange={(e) => updateField("logo", e.target.value)}
                    placeholder="https://.../logo.png" />
                ) : (
                  <input type="file" accept="image/*" className="file-input"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      if (file.size > 2 * 1024 * 1024) {
                        alert("Image too large (max 2MB)");
                        e.target.value = "";
                        return;
                      }
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setLogoPreview(reader.result);
                        updateField("logo", reader.result);
                      };
                      reader.readAsDataURL(file);
                    }} />
                )}
                {logoPreview && (
                  <img src={logoPreview} alt="Logo preview" className="logo-preview" />
                )}
              </label>
              <label>
                Start date
                <input
                  type="date"
                  value={config.startDate}
                  onChange={(event) =>
                    updateField("startDate", event.target.value)
                  }
                  className={stepErrors.startDate ? "input-error" : ""}
                />
                {stepErrors.startDate && <span className="field-error">{stepErrors.startDate}</span>}
              </label>
              <label>
                End date
                <input
                  type="date"
                  value={config.endDate}
                  onChange={(event) =>
                    updateField("endDate", event.target.value)
                  }
                  className={stepErrors.endDate ? "input-error" : ""}
                />
                {stepErrors.endDate && <span className="field-error">{stepErrors.endDate}</span>}
              </label>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="builder-step">
            <h2>Registration mode</h2>
            <div className="reg-mode-grid">
              <button
                type="button"
                className={`reg-mode-card${config.registrationMode !== "private" ? " selected" : ""}`}
                onClick={() => onChange({ ...config, registrationMode: "public", registrationCode: "" })}
              >
                <div className="reg-mode-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                  </svg>
                </div>
                <div className="reg-mode-label">Public</div>
                <div className="reg-mode-desc">Anyone with the link can register and join</div>
              </button>
              <button
                type="button"
                className={`reg-mode-card${config.registrationMode === "private" ? " selected" : ""}`}
                onClick={() => {
                  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
                  const part = () => Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
                  const code = `${part()}-${part()}`;
                  onChange({ ...config, registrationMode: "private", registrationCode: code });
                }}
              >
                <div className="reg-mode-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <div className="reg-mode-label">Private</div>
                <div className="reg-mode-desc">A registration code is required to join</div>
              </button>
            </div>

            {config.registrationMode === "private" && (
              <div className="reg-code-section">
                <label className="reg-code-label">Registration code</label>
                <div className="reg-code-input-row">
                  <input
                    type="text"
                    className="reg-code-input"
                    value={config.registrationCode || ""}
                    onChange={(e) => updateField("registrationCode", e.target.value.toUpperCase())}
                    placeholder="e.g. XK7-M9Q"
                  />
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => {
                      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
                      const part = () => Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
                      onChange({ ...config, registrationCode: `${part()}-${part()}` });
                    }}
                  >
                    Regenerate
                  </button>
                </div>
                <p className="reg-code-hint">Share this code with your attendees so they can register.</p>
              </div>
            )}
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
