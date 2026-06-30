import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RefreshCw, Clipboard, QrCode, Save, Image, Link, Upload, Palette, Globe, Lock, Tv, Smartphone } from "lucide-react";
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
  const [statusType, setStatusType] = useState("success");
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
          setStatusType("error");
        }
      } catch (err) {
        console.error("Failed to load conference settings:", err);
        setStatus("Failed to load settings.");
        setStatusType("error");
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
      setStatusType("error");
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
      setStatusType("success");
    } catch (error) {
      console.error(error);
      setStatus("Unable to save settings.");
      setStatusType("error");
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
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your conference branding, registration, and integrations.</p>
        </div>
        <div className="settings-theme-preview" style={{ background: config.themeColor }}>
          {config.brandAcronym || "EM"}
        </div>
      </div>

      {status && (
        <div className={`settings-status ${statusType === "error" ? "settings-status--error" : ""}`}>
          {status}
        </div>
      )}

      <form className="settings-form" onSubmit={handleSave}>

        {/* ====== Branding ====== */}
        <div className="settings-section">
          <div className="settings-section-header">
            <Palette size={20} />
            <div>
              <h2>Branding</h2>
              <p>Your conference identity — name, logo, and colors.</p>
            </div>
          </div>

          <div className="settings-section-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Conference name</label>
                <input
                  type="text"
                  value={config.conferenceName}
                  onChange={(e) => handleChange("conferenceName", e.target.value)}
                  placeholder="e.g. Algeria Tech Summit 2026"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Brand acronym</label>
                <input
                  type="text"
                  value={config.brandAcronym}
                  onChange={(e) => handleChange("brandAcronym", e.target.value)}
                  placeholder="e.g. ATS"
                  maxLength={6}
                />
                <span className="form-hint">Shown as a badge in the webapp header.</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tagline</label>
              <input
                type="text"
                value={config.tagline}
                onChange={(e) => handleChange("tagline", e.target.value)}
                placeholder="e.g. Where innovation meets opportunity"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                value={config.conferenceDescription}
                onChange={(e) => handleChange("conferenceDescription", e.target.value)}
                placeholder="A short description of your conference..."
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Theme color</label>
                <div className="color-picker-wrap">
                  <input
                    type="color"
                    value={config.themeColor}
                    onChange={(e) => handleChange("themeColor", e.target.value)}
                  />
                  <input
                    type="text"
                    value={config.themeColor}
                    onChange={(e) => handleChange("themeColor", e.target.value)}
                    placeholder="#0d7e52"
                    maxLength={7}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Logo</label>
                <div className="logo-upload-area">
                  <div className="logo-mode-tabs">
                    <button
                      type="button"
                      className={`logo-mode-tab ${logoMode === "url" ? "active" : ""}`}
                      onClick={() => setLogoMode("url")}
                    >
                      <Link size={14} /> URL
                    </button>
                    <button
                      type="button"
                      className={`logo-mode-tab ${logoMode === "upload" ? "active" : ""}`}
                      onClick={() => setLogoMode("upload")}
                    >
                      <Upload size={14} /> Upload
                    </button>
                  </div>
                  {logoMode === "url" ? (
                    <div className="logo-url-input">
                      <Link size={16} className="input-icon" />
                      <input
                        type="text"
                        value={config.conferenceLogo}
                        onChange={(e) => handleChange("conferenceLogo", e.target.value)}
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                  ) : (
                    <div className="logo-upload-input">
                      <Upload size={16} className="input-icon" />
                      <input
                        type="file"
                        accept="image/*"
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
                        }}
                      />
                    </div>
                  )}
                  {logoPreview && (
                    <div className="logo-preview-area">
                      <img src={logoPreview} alt="Logo preview" className="logo-preview" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ====== Live Stream ====== */}
        <div className="settings-section">
          <div className="settings-section-header">
            <Tv size={20} />
            <div>
              <h2>Live Stream</h2>
              <p>Connect your HLS stream for attendees to watch live sessions.</p>
            </div>
          </div>

          <div className="settings-section-body">
            <div className="form-group">
              <label className="form-label">Stream URL (HLS / .m3u8)</label>
              <div className="input-with-icon">
                <Globe size={16} className="input-icon" />
                <input
                  type="url"
                  value={config.streamUrl}
                  onChange={(e) => handleChange("streamUrl", e.target.value)}
                  placeholder="http://your-server/live/index.m3u8"
                />
              </div>
              <span className="form-hint">Leave blank to hide the live player. Supports any HLS-compatible CDN.</span>
            </div>
          </div>
        </div>

        {/* ====== Registration ====== */}
        <div className="settings-section">
          <div className="settings-section-header">
            <Lock size={20} />
            <div>
              <h2>Registration</h2>
              <p>Control how attendees sign up and access your conference.</p>
            </div>
          </div>

          <div className="settings-section-body">
            <div className="form-group">
              <label className="form-label">Registration mode</label>
              <div className="reg-mode-cards">
                <label className={`reg-mode-card ${config.registrationMode === "public" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="registrationMode"
                    value="public"
                    checked={config.registrationMode === "public"}
                    onChange={() => handleChange("registrationMode", "public")}
                  />
                  <Globe size={20} />
                  <div>
                    <strong>Public</strong>
                    <span>Anyone with the link can register</span>
                  </div>
                </label>
                <label className={`reg-mode-card ${config.registrationMode === "private" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="registrationMode"
                    value="private"
                    checked={config.registrationMode === "private"}
                    onChange={() => handleChange("registrationMode", "private")}
                  />
                  <Lock size={20} />
                  <div>
                    <strong>Private</strong>
                    <span>Requires a registration code</span>
                  </div>
                </label>
              </div>
            </div>

            {config.registrationMode === "private" && (
              <div className="form-group">
                <label className="form-label">Registration code</label>
                <div className="code-input-row">
                  <input
                    type="text"
                    value={config.registrationCode}
                    onChange={(e) => handleChange("registrationCode", e.target.value)}
                    placeholder="e.g. XK7-M9Q"
                    className="code-input"
                  />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
                      const genPart = () => Array.from({ length: 3 }, () => characters[Math.floor(Math.random() * characters.length)]).join("");
                      handleChange("registrationCode", `${genPart()}-${genPart()}`);
                    }}
                  >
                    <RefreshCw size={16} /> Generate
                  </button>
                </div>
                <span className="form-hint">Attendees must enter this code after creating their account.</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Invite link</label>
              <div className="invite-link-row">
                <input
                  type="text"
                  readOnly
                  value={inviteUrl}
                  className="invite-link-input"
                />
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(inviteUrl);
                    setStatus("Invite link copied!");
                    setStatusType("success");
                  }}
                >
                  <Clipboard size={16} /> Copy
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  disabled
                  title="Coming soon"
                >
                  <QrCode size={16} /> QR
                </button>
              </div>
              <span className="form-hint">Share this link with your attendees to let them register.</span>
            </div>
          </div>
        </div>

        {/* ====== Mobile App ====== */}
        <div className="settings-section">
          <div className="settings-section-header">
            <Smartphone size={20} />
            <div>
              <h2>Mobile Application</h2>
              <p>Your branded mobile app for attendees.</p>
            </div>
          </div>

          <div className="settings-section-body">
            <div className="mobile-app-status">
              <div className="mobile-app-icon">
                <Smartphone size={32} />
              </div>
              <div>
                <strong>Conference Mobile App</strong>
                <p>Generate a branded APK with your conference name, logo, and theme.</p>
              </div>
            </div>
            <div className="mobile-app-actions">
              <button type="button" className="btn-primary" disabled>
                <Smartphone size={16} /> Build Mobile App
              </button>
              <span className="form-hint">Available in the Applications page.</span>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button type="submit" className="btn-primary btn-large">
            <Save size={18} /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
