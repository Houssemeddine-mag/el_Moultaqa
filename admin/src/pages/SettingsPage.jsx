import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getConferenceConfig, saveConferenceConfig } from "../sharedConfig";
import backend from "../backend.js";

const defaultConfig = {
  conferenceName: "ElMoultaqa Conference",
  conferenceLogo: "",
  themeColor: "#0d7e52",
  brandAcronym: "EM",
  tagline: "Conference platform for modern hybrid events",
  conferenceDescription: "",
};

export default function SettingsPage() {
  const { orgSlug } = useParams();
  const [config, setConfig] = useState(defaultConfig);
  const [status, setStatus] = useState("");

  // Registration & Access states
  const [registrationMode, setRegistrationMode] = useState("public");
  const [registrationCode, setRegistrationCode] = useState("");

  useEffect(() => {
    // 1. Load theme config
    const stored = getConferenceConfig();
    if (stored) {
      setConfig({
        conferenceName: stored.name || defaultConfig.conferenceName,
        conferenceLogo: stored.logo || defaultConfig.conferenceLogo,
        themeColor: stored.themeColor || defaultConfig.themeColor,
        brandAcronym: stored.brandInitials || defaultConfig.brandAcronym,
        tagline: stored.tagline || defaultConfig.tagline,
        conferenceDescription:
          stored.description || defaultConfig.conferenceDescription,
      });
    }

    // 2. Load registration settings from Supabase
    if (orgSlug) {
      async function loadRegSettings() {
        try {
          const data = await backend.getRegistrationSettings(orgSlug);
          setRegistrationMode(data.registrationMode);
          setRegistrationCode(data.registrationCode || "");
        } catch (err) {
          console.error("Failed to load registration settings:", err);
        }
      }
      loadRegSettings();
    }
  }, [orgSlug]);

  const handleChange = (key, value) => {
    setConfig((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      // 1. Save theme config locally
      saveConferenceConfig({
        name: config.conferenceName,
        shortName: config.conferenceName,
        logo: config.conferenceLogo,
        themeColor: config.themeColor,
        brandInitials: config.brandAcronym,
        tagline: config.tagline,
        description: config.conferenceDescription,
      });

      // 2. Save registration settings in organizations table
      if (orgSlug) {
        await backend.updateRegistrationSettings(orgSlug, registrationMode, registrationCode);
      }

      setStatus("Saved conference theme, brand, and registration settings.");
    } catch (error) {
      console.error(error);
      setStatus("Unable to save settings.");
    }
  };

  const inviteUrl = `${import.meta.env.VITE_WEBAPP_URL || (window.location.origin.includes("localhost") ? "http://localhost:5173" : window.location.origin.replace("admin", "webapp"))}/c/${orgSlug}/auth`;

  return (
    <div className="page-card">
      <div className="page-header">
        <h1>Conference settings</h1>
        <p>Customize the webapp theme, logo, and brand details.</p>
      </div>

      <form className="settings-form" onSubmit={handleSave}>
        <label>
          Conference name
          <input
            type="text"
            value={config.conferenceName}
            onChange={(event) =>
              handleChange("conferenceName", event.target.value)
            }
          />
        </label>

        <label>
          Brand acronym
          <input
            type="text"
            value={config.brandAcronym}
            onChange={(event) =>
              handleChange("brandAcronym", event.target.value)
            }
          />
        </label>

        <label>
          Theme color
          <input
            type="color"
            value={config.themeColor}
            onChange={(event) => handleChange("themeColor", event.target.value)}
          />
        </label>

        <label>
          Conference logo URL
          <input
            type="text"
            value={config.conferenceLogo}
            onChange={(event) =>
              handleChange("conferenceLogo", event.target.value)
            }
            placeholder="https://.../logo.png"
          />
        </label>

        <label>
          Tagline
          <input
            type="text"
            value={config.tagline}
            onChange={(event) => handleChange("tagline", event.target.value)}
          />
        </label>

        <label>
          Conference description (for mobile app)
          <textarea
            value={config.conferenceDescription}
            onChange={(event) =>
              handleChange("conferenceDescription", event.target.value)
            }
            placeholder="Enter a brief description about your conference..."
            rows="4"
          />
        </label>

        <hr style={{ border: "0", borderTop: "1px solid rgba(255, 255, 255, 0.1)", margin: "2.5rem 0 1.5rem" }} />

        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.25rem", color: "var(--brand-primary, #0d7e52)" }}>Attendee Registration</h2>
        <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          Control how attendees register for your conference and get access to the webapp.
        </p>

        <div className="registration-mode-selector" style={{ marginBottom: "1.5rem" }}>
          <span style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", fontSize: "0.9rem" }}>Registration Mode</span>
          <div style={{ display: "flex", gap: "2rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.9rem" }}>
              <input
                type="radio"
                name="registrationMode"
                value="public"
                checked={registrationMode === "public"}
                onChange={() => setRegistrationMode("public")}
              />
              Public (anyone with the link can join)
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.9rem" }}>
              <input
                type="radio"
                name="registrationMode"
                value="private"
                checked={registrationMode === "private"}
                onChange={() => setRegistrationMode("private")}
              />
              Private (requires a registration code)
            </label>
          </div>
        </div>

        {registrationMode === "private" && (
          <label style={{ display: "block", marginBottom: "1.5rem" }}>
            Registration Code
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
              <input
                type="text"
                value={registrationCode}
                onChange={(event) => setRegistrationCode(event.target.value)}
                placeholder="e.g. XK7-M9Q"
                style={{ flex: 1, textTransform: "uppercase" }}
              />
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: "0 1.5rem", borderRadius: "8px", cursor: "pointer", background: "rgba(255, 255, 255, 0.08)", color: "#fff", border: "1px solid rgba(255, 255, 255, 0.15)" }}
                onClick={() => {
                  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // readable chars
                  const genPart = () => Array.from({ length: 3 }, () => characters[Math.floor(Math.random() * characters.length)]).join("");
                  setRegistrationCode(`${genPart()}-${genPart()}`);
                }}
              >
                🔄 Generate
              </button>
            </div>
            <small style={{ color: "rgba(255, 255, 255, 0.5)", marginTop: "0.25rem", display: "block" }}>
              Attendees must enter this code manually after creating their account.
            </small>
          </label>
        )}

        <div style={{ marginBottom: "2rem" }}>
          <span style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", fontSize: "0.9rem" }}>Invite Link</span>
          <div style={{ display: "flex", gap: "1rem" }}>
            <input
              type="text"
              readOnly
              value={inviteUrl}
              style={{ flex: 1, background: "rgba(255, 255, 255, 0.05)", cursor: "default" }}
            />
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: "0 1.5rem", borderRadius: "8px", cursor: "pointer", background: "rgba(255, 255, 255, 0.08)", color: "#fff", border: "1px solid rgba(255, 255, 255, 0.15)" }}
              onClick={() => {
                navigator.clipboard.writeText(inviteUrl);
                alert("Invite link copied to clipboard!");
              }}
            >
              📋 Copy Link
            </button>
            <button
              type="button"
              className="btn-secondary"
              disabled
              title="QR code generation coming soon"
              style={{ padding: "0 1.5rem", borderRadius: "8px", cursor: "not-allowed", opacity: 0.5, background: "rgba(255, 255, 255, 0.04)", color: "rgba(255, 255, 255, 0.3)", border: "1px solid rgba(255, 255, 255, 0.08)" }}
            >
              📱 QR Code (soon)
            </button>
          </div>
        </div>

        <button type="submit" className="btn-primary">
          Save settings
        </button>

        {status && <p className="settings-status">{status}</p>}
      </form>
    </div>
  );
}
