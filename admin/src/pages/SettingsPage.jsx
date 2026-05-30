import { useEffect, useState } from "react";
import { getConferenceConfig, saveConferenceConfig } from "../sharedConfig";

const defaultConfig = {
  conferenceName: "ElMoultaqa Conference",
  conferenceLogo: "",
  themeColor: "#0d7e52",
  brandAcronym: "EM",
  tagline: "Conference platform for modern hybrid events",
  conferenceDescription: "",
};

export default function SettingsPage() {
  const [config, setConfig] = useState(defaultConfig);
  const [status, setStatus] = useState("");

  useEffect(() => {
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
  }, []);

  const handleChange = (key, value) => {
    setConfig((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      saveConferenceConfig({
        name: config.conferenceName,
        shortName: config.conferenceName,
        logo: config.conferenceLogo,
        themeColor: config.themeColor,
        brandInitials: config.brandAcronym,
        tagline: config.tagline,
        description: config.conferenceDescription,
      });
      setStatus("Saved conference theme and brand settings.");
    } catch (error) {
      console.error(error);
      setStatus("Unable to save settings.");
    }
  };

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

        <button type="submit" className="btn-primary">
          Save settings
        </button>

        {status && <p className="settings-status">{status}</p>}
      </form>
    </div>
  );
}
