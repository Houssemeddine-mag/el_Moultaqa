import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RefreshCw, Clipboard, Save, Upload, Palette, Globe, Lock, Smartphone } from "lucide-react";
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
};

export default function SettingsPage() {
  const { orgSlug } = useParams();
  const navigate = useNavigate();
  const [config, setConfig] = useState(defaultConfig);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("success");
  const [loading, setLoading] = useState(true);
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
          });
          setLogoPreview(loadedLogo);
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
          <p>Manage your conference branding, registration, and attendee access.</p>
        </div>
      </div>

      {status && (
        <div className={`settings-status ${statusType === "error" ? "settings-status--error" : ""}`}>
          {status}
        </div>
      )}

      <form className="settings-form" onSubmit={handleSave}>

        {/* ====== Branding & Identity ====== */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-accent" style={{ background: config.themeColor }} />
            <Palette size={20} />
            <div>
              <h2>Branding & Identity</h2>
              <p>Your conference name, visual identity, and how it appears to attendees.</p>
            </div>
          </div>

          <div className="settings-card-body">
            <div className="settings-grid">
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
                <label className="form-label">Acronym</label>
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

            <div className="settings-grid">
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
                <label className="form-label">Conference logo</label>
                <div className="logo-input-row">
                  <div className="logo-url-field">
                    <input
                      type="text"
                      value={config.conferenceLogo}
                      onChange={(e) => {
                        handleChange("conferenceLogo", e.target.value);
                        setLogoPreview(e.target.value);
                      }}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <div className="logo-upload-field">
                    <label className="logo-upload-btn">
                      <Upload size={16} />
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
                    </label>
                  </div>
                </div>
                {logoPreview && (
                  <div className="logo-preview-bar">
                    <img src={logoPreview} alt="Logo" className="logo-thumb" />
                    {logoPreview !== config.conferenceLogo && (
                      <span className="form-hint">Uploaded image</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="brand-preview">
              <div className="brand-preview-header" style={{ background: config.themeColor }}>
                <div className="brand-preview-logo">
                  {logoPreview ? (
                    <img src={logoPreview} alt="" />
                  ) : (
                    <span>{config.brandAcronym?.charAt(0) || "E"}</span>
                  )}
                </div>
                <div className="brand-preview-info">
                  <span className="brand-preview-name">{config.conferenceName}</span>
                  <span className="brand-preview-badge">{config.brandAcronym}</span>
                </div>
              </div>
              <div className="brand-preview-body">
                <span className="brand-preview-label">Brand preview</span>
                <p className="brand-preview-tagline">{config.tagline || "Your tagline appears here"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ====== Registration & Access ====== */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-accent" style={{ background: config.themeColor }} />
            <Lock size={20} />
            <div>
              <h2>Registration & Access</h2>
              <p>Control how attendees sign up and access your conference.</p>
            </div>
          </div>

          <div className="settings-card-body">
            <div className="form-group">
              <label className="form-label">Registration mode</label>
              <div className="option-cards">
                <button
                  type="button"
                  className={`option-card ${config.registrationMode === "public" ? "active" : ""}`}
                  onClick={() => handleChange("registrationMode", "public")}
                >
                  <Globe size={20} />
                  <div>
                    <strong>Public</strong>
                    <span>Anyone with the link can register</span>
                  </div>
                </button>
                <button
                  type="button"
                  className={`option-card ${config.registrationMode === "private" ? "active" : ""}`}
                  onClick={() => handleChange("registrationMode", "private")}
                >
                  <Lock size={20} />
                  <div>
                    <strong>Private</strong>
                    <span>Requires a registration code</span>
                  </div>
                </button>
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
              </div>
              <span className="form-hint">Share this link with your attendees to let them register.</span>
            </div>
          </div>
        </div>

        {/* ====== Mobile App ====== */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-accent" style={{ background: config.themeColor }} />
            <Smartphone size={20} />
            <div>
              <h2>Mobile Application</h2>
              <p>Your branded mobile app for attendees.</p>
            </div>
          </div>

          <div className="settings-card-body">
            <div className="feature-placeholder">
              <div className="feature-placeholder-icon">
                <Smartphone size={28} />
              </div>
              <div className="feature-placeholder-text">
                <strong>Conference Mobile App</strong>
                <p>Generate a branded APK with your conference name, logo, and theme color.</p>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => navigate(`/c/${orgSlug}/admin/app/applications`)}
              >
                <Smartphone size={16} /> Create App
              </button>
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <button type="submit" className="btn-primary btn-large">
            <Save size={18} /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
