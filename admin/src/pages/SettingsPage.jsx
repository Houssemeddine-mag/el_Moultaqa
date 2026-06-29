import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RefreshCw, Clipboard, QrCode } from "lucide-react";
import backend from "../backend.js";

const defaultConfig = {
  conferenceName: "ElMoultaqa Conference",
  brandAcronym: "EM",
  themeColor: "#0d7e52",
  conferenceLogo: "",
  tagline: "Conference platform for modern hybrid events",
  conferenceDescription: "",
  registrationMode: "public",
  registrationCode: "",
  streamUrl: "",
};

export default function SettingsPage() {
  const { orgSlug } = useParams();
  const [config, setConfig] = useState(defaultConfig);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [logoMode, setLogoMode] = useState("url");
  const [logoPreview, setLogoPreview] = useState("");
  const [eventId, setEventId] = useState(null);

  useEffect(() => {
    async function loadEvent() {
      setLoading(true);
      try {
        const events = await backend.getEvents();
        if (events && events.length > 0) {
          const ev = events[0];
          setEventId(ev.id);
          const loadedLogo = ev.cover_image_url || defaultConfig.conferenceLogo;
          setConfig({
            conferenceName: ev.title || defaultConfig.conferenceName,
            brandAcronym: ev.settings?.brandAcronym || ev.short_name || defaultConfig.brandAcronym,
            themeColor: ev.settings?.themeColor || defaultConfig.themeColor,
            conferenceLogo: loadedLogo,
            tagline: ev.settings?.tagline || defaultConfig.tagline,
            conferenceDescription: ev.description || defaultConfig.conferenceDescription,
            registrationMode: ev.settings?.registrationMode || "public",
            registrationCode: ev.settings?.registrationCode || "",
            streamUrl: ev.settings?.stream_url || "",
          });
          if (loadedLogo.startsWith("data:image/")) {
            setLogoMode("upload");
            setLogoPreview(loadedLogo);
          }
        } else {
          setStatus("No conference found. Create an event first.");
        }
      } catch (err) {
        console.error("Failed to load conference settings:", err);
        setStatus("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, []);

  const handleChange = (key, value) => {
    setConfig((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!eventId) {
      setStatus("No conference to save. Create an event first.");
      return;
    }
    try {
      await backend.updateEvent(eventId, {
        title: config.conferenceName,
        description: config.conferenceDescription,
        cover_image_url: config.conferenceLogo,
      });

      await backend.updateEventSettings(eventId, {
        brandAcronym: config.brandAcronym,
        themeColor: config.themeColor,
        tagline: config.tagline,
        registrationMode: config.registrationMode,
        registrationCode: config.registrationCode,
        stream_url: config.streamUrl.trim() || null,
      });

      setStatus("Conference settings saved successfully.");
    } catch (error) {
      console.error(error);
      setStatus("Unable to save settings.");
    }
  };

  const inviteUrl = `${import.meta.env.VITE_WEBAPP_URL || (window.location.origin.includes("localhost") ? "http://localhost:5173" : window.location.origin.replace("admin", "webapp"))}/c/${orgSlug}/auth`;

  if (loading) {
    return (
      <div className="page-card">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading conference settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-card">
      <div className="page-header">
        <h1>Conference settings</h1>
        <p>Customize your conference theme, logo, and registration options.</p>
      </div>

      <form className="settings-form" onSubmit={handleSave}>
        <label>
          Conference name
          <input
            type="text"
            value={config.conferenceName}
            onChange={(e) =>
              handleChange("conferenceName", e.target.value)
            }
          />
        </label>

        <label>
          Brand acronym
          <input
            type="text"
            value={config.brandAcronym}
            onChange={(e) =>
              handleChange("brandAcronym", e.target.value)
            }
          />
        </label>

        <label>
          Theme color
          <input
            type="color"
            value={config.themeColor}
            onChange={(e) => handleChange("themeColor", e.target.value)}
          />
        </label>

        <label>
          Conference logo
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
            <input type="text" value={config.conferenceLogo}
              onChange={(e) => handleChange("conferenceLogo", e.target.value)}
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
                  handleChange("conferenceLogo", reader.result);
                };
                reader.readAsDataURL(file);
              }} />
          )}
          {logoPreview && (
            <img src={logoPreview} alt="Logo preview" className="logo-preview" />
          )}
        </label>

        <label>
          Tagline
          <input
            type="text"
            value={config.tagline}
            onChange={(e) => handleChange("tagline", e.target.value)}
          />
        </label>

        <label>
          Conference description
          <textarea
            value={config.conferenceDescription}
            onChange={(e) =>
              handleChange("conferenceDescription", e.target.value)
            }
            placeholder="Enter a brief description about your conference..."
            rows="4"
          />
        </label>

        <hr style={{ border: "0", borderTop: "1px solid rgba(255, 255, 255, 0.1)", margin: "2.5rem 0 1.5rem" }} />

        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.25rem", color: "var(--brand-primary, #0d7e52)" }}>Live Stream</h2>
        <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          Set the HLS stream URL that attendees will see in the Live tab. Leave blank to hide the player.
        </p>

        <label>
          Stream URL (HLS / .m3u8)
          <input
            type="url"
            value={config.streamUrl}
            onChange={(e) => handleChange("streamUrl", e.target.value)}
            placeholder="http://your-server/live/index.m3u8"
          />
          <small style={{ color: "rgba(255,255,255,0.45)", marginTop: "0.25rem", display: "block" }}>
            Paste your HLS manifest URL. Supports rtmp re-streamed via nginx or any HLS-compatible CDN.
          </small>
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
                checked={config.registrationMode === "public"}
                onChange={() => handleChange("registrationMode", "public")}
              />
              Public (anyone with the link can join)
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.9rem" }}>
              <input
                type="radio"
                name="registrationMode"
                value="private"
                checked={config.registrationMode === "private"}
                onChange={() => handleChange("registrationMode", "private")}
              />
              Private (requires a registration code)
            </label>
          </div>
        </div>

        {config.registrationMode === "private" && (
          <label style={{ display: "block", marginBottom: "1.5rem" }}>
            Registration Code
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
              <input
                type="text"
                value={config.registrationCode}
                onChange={(e) => handleChange("registrationCode", e.target.value)}
                placeholder="e.g. XK7-M9Q"
                style={{ flex: 1, textTransform: "uppercase" }}
              />
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: "0 1.5rem", borderRadius: "8px", cursor: "pointer", background: "rgba(255, 255, 255, 0.08)", color: "#fff", border: "1px solid rgba(255, 255, 255, 0.15)" }}
                onClick={() => {
                  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
                  const genPart = () => Array.from({ length: 3 }, () => characters[Math.floor(Math.random() * characters.length)]).join("");
                  handleChange("registrationCode", `${genPart()}-${genPart()}`);
                }}
              >
                <RefreshCw size={16} style={{ verticalAlign: "middle", marginRight: 4 }} /> Generate
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
              <Clipboard size={16} style={{ verticalAlign: "middle", marginRight: 4 }} /> Copy Link
            </button>
            <button
              type="button"
              className="btn-secondary"
              disabled
              title="QR code generation coming soon"
              style={{ padding: "0 1.5rem", borderRadius: "8px", cursor: "not-allowed", opacity: 0.5, background: "rgba(255, 255, 255, 0.04)", color: "rgba(255, 255, 255, 0.3)", border: "1px solid rgba(255, 255, 255, 0.08)" }}
            >
              <QrCode size={16} style={{ verticalAlign: "middle", marginRight: 4 }} /> QR Code (soon)
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
