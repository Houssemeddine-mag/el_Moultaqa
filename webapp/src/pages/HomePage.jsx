import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/HomePage.css";
import elmLogo from "@global/logo.png";
import { getDefaultSponsors } from "@global/defaultSponsors";
import { fetchKeynoteSpeakers, fetchSponsors, isServiceReady } from "../services/localService";
import { useConferenceConfig } from "../context/ConferenceContext.jsx";
import Reveal from "../components/Reveal.jsx";

function getInitials(name = "") {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function speakerImageSrc(speaker) {
  const v = speaker?.photo || speaker?.image || speaker?.imageData || "";
  if (!v || typeof v !== "string") return null;
  if (v.startsWith("data:") || v.startsWith("http") || v.startsWith("/")) return v;
  return `data:image/jpeg;base64,${v}`;
}

export default function HomePage() {
  const navigate = useNavigate();
  const conferenceConfig = useConferenceConfig();
  const [keynotes, setKeynotes] = useState([]);
  const [loadingKeynotes, setLoadingKeynotes] = useState(true);
  const [sponsors, setSponsors] = useState([]);
  const [selectedSpeakerId, setSelectedSpeakerId] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadKeynotes(isRefresh = false) {
      try {
        if (!isRefresh) setLoadingKeynotes(true);
        // ConferenceProvider initializes the service async — wait briefly
        // instead of failing on the init race (same pattern as sponsors).
        let attempts = 0;
        while (active && !isServiceReady() && attempts < 40) {
          attempts += 1;
          await new Promise((r) => setTimeout(r, 250));
        }
        if (!active || !isServiceReady()) return;
        const speakers = await fetchKeynoteSpeakers();
        if (!active) return;
        setKeynotes(speakers);
      } catch (error) {
        console.error("Failed to load keynote speakers", error);
      } finally {
        if (active) setLoadingKeynotes(false);
      }
    }

    loadKeynotes(false);
    // Pick up admin edits without a hard reload.
    const onFocus = () => loadKeynotes(true);
    window.addEventListener("focus", onFocus);
    return () => {
      active = false;
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const selectedSpeaker =
    keynotes.find((s) => s.id === selectedSpeakerId) || keynotes[0] || null;

  useEffect(() => {
    let active = true;

    async function loadSponsors(isRefresh = false) {
      try {
        // ConferenceProvider initializes the service async — wait briefly
        // instead of rendering a brand-only ribbon on the init race.
        let attempts = 0;
        while (active && !isServiceReady() && attempts < 40) {
          attempts += 1;
          await new Promise((r) => setTimeout(r, 250));
        }
        if (!active || !isServiceReady()) return;
        const list = await fetchSponsors();
        if (!active) return;

        setSponsors(
          list
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((sponsor) => ({
              id: sponsor.id,
              alt: sponsor.name || "Sponsor",
              name: sponsor.name || "Sponsor",
              src: sponsor.logoData || sponsor.image || sponsor.imageData || "",
              hasLogo: Boolean(sponsor.hasLogo ?? (sponsor.logoData || sponsor.image || sponsor.imageData)),
            })),
        );
      } catch (error) {
        console.error("Failed to load sponsors", error);
        if (!isRefresh) setSponsors([]);
      }
    }

    loadSponsors(false);

    const handleStorage = (event) => {
      if (event.key === "elm_sponsors") {
        loadSponsors(true);
      }
    };
    const onFocus = () => loadSponsors(true);

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", onFocus);
    return () => {
      active = false;
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  // Permanent defaults first (conference itself + El Moultaqa), then real
  // sponsors — the ribbon is never empty and never duplicates one logo.
  const ribbonBase = (() => {
    const defaults = getDefaultSponsors({
      conferenceName: conferenceConfig.brand || "Conference",
      conferenceLogo: conferenceConfig.logoUrl || "",
      conferenceWebsite: conferenceConfig.website || "",
      platformLogo: elmLogo,
    }).map((d) => ({
      id: d.id,
      alt: d.name,
      name: d.name,
      src: d.logoData || "",
      hasLogo: Boolean(d.logoData),
    }));
    return [...defaults, ...sponsors];
  })();
  // Each logo renders exactly once — the row wraps and centers itself
  // around however many sponsors exist.
  const ribbonItems = ribbonBase;

  return (
    <div className="page-shell home-page">
      <section className="home-upper">
        <div className="home-hero">
          <div className="hero-copy">
            {conferenceConfig.shortName && (
              <span className="eyebrow">{conferenceConfig.shortName}</span>
            )}
            <h1>{conferenceConfig.brand || "Conference"}</h1>
            <div className="hero-dates-location">
              {conferenceConfig.dates && (
                <div className="date-info">
                  <span className="icon">📅</span>
                  <span>{conferenceConfig.dates}</span>
                </div>
              )}
              {conferenceConfig.location && (
                <div className="location-info">
                  <span className="icon">📍</span>
                  <span>{conferenceConfig.location}</span>
                </div>
              )}
            </div>
            {(conferenceConfig.tagline || conferenceConfig.description) && (
              <p className="hero-tagline">
                {conferenceConfig.tagline || conferenceConfig.description}
              </p>
            )}
            <div className="hero-actions">
              <button
                className="primary-button"
                type="button"
                onClick={() => {
                  const slug = conferenceConfig.id || window.location.pathname.match(/^\/c\/([^\/]+)/)?.[1];
                  if (slug) navigate(`/c/${slug}/program`);
                }}
              >
                Explore the program
              </button>
              <button
                className="secondary-button"
                type="button"
                onClick={() => {
                  const section = document.getElementById("keynote-speakers");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                View speakers
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-logo-wrap logo-only">
              <div className="hero-brand-mark">
                <img
                  src={conferenceConfig.logoUrl || elmLogo}
                  alt={conferenceConfig.name || conferenceConfig.brand}
                  className="hero-elm-logo"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Reveal as="section" className="sponsor-ribbon">
        <div className="sponsor-header">
          <div>
            <h3>Official sponsors</h3>
          </div>
        </div>
        <div className="sponsor-track-wrap">
          <div className="sponsor-track">
            {ribbonItems.map((sponsor, index) => (
              <div
                key={`${sponsor.id || sponsor.alt}-${index}`}
                className="sponsor-item"
              >
                {sponsor.src ? (
                  <img src={sponsor.src} alt={sponsor.alt} />
                ) : (
                  <span
                    className="sponsor-text-chip"
                    title={sponsor.alt}
                    style={{
                      display: "inline-block",
                      padding: "10px 18px",
                      borderRadius: 999,
                      background: "var(--bg, #f2f5f3)",
                      border: "1px solid var(--border, #e2e8e4)",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {sponsor.name || sponsor.alt}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal as="section" id="keynote-speakers" className="home-info-grid keynote-section">
        <div className="section-header">
          <div>
            <h3>Meet the conference voices</h3>
          </div>
        </div>

        {loadingKeynotes ? (
          <div className="loading-message">Loading keynote speakers…</div>
        ) : keynotes.length === 0 ? (
          <div className="empty-message">
            No keynote speakers were found in the backend. Please check back
            later.
          </div>
        ) : (
          <div className="speaker-select">
            <div
              className="speaker-roster"
              role="listbox"
              aria-label="Keynote speakers"
            >
              {keynotes.map((speaker, index) => {
                const img = speakerImageSrc(speaker);
                const isActive =
                  selectedSpeaker && selectedSpeaker.id === speaker.id;
                return (
                  <button
                    key={speaker.id}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    className={`speaker-pick${isActive ? " active" : ""}`}
                    onClick={() => setSelectedSpeakerId(speaker.id)}
                  >
                    <span className="speaker-pick-index" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="speaker-pick-avatar" aria-hidden="true">
                      {img ? (
                        <img src={img} alt="" />
                      ) : (
                        <span>{getInitials(speaker.name)}</span>
                      )}
                    </span>
                    <span className="speaker-pick-name">
                      {speaker.name || "Unknown"}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedSpeaker && (
              <article
                className="speaker-showcase"
                key={selectedSpeaker.id}
                aria-live="polite"
              >
                <div className="speaker-showcase-media">
                  {speakerImageSrc(selectedSpeaker) ? (
                    <img
                      src={speakerImageSrc(selectedSpeaker)}
                      alt={selectedSpeaker.name || "Speaker image"}
                    />
                  ) : (
                    <span className="speaker-showcase-initials">
                      {getInitials(selectedSpeaker.name)}
                    </span>
                  )}
                  <span
                    className="speaker-showcase-badge"
                    aria-hidden="true"
                  >
                    ★ Keynote
                  </span>
                </div>
                <div className="speaker-showcase-body">
                  <span className="eyebrow">Featured speaker</span>
                  <h2>{selectedSpeaker.name || "Unknown Speaker"}</h2>
                  {selectedSpeaker.title && (
                    <p className="speaker-showcase-title">
                      {selectedSpeaker.title}
                    </p>
                  )}
                  {(selectedSpeaker.company ||
                    selectedSpeaker.institution) && (
                    <span className="speaker-showcase-org">
                      {selectedSpeaker.company ||
                        selectedSpeaker.institution}
                    </span>
                  )}
                  <div className="speaker-showcase-about">
                    <span>About</span>
                    <p>
                      {selectedSpeaker.biography ||
                        selectedSpeaker.bio ||
                        selectedSpeaker.keynoteDescription ||
                        "No biography available."}
                    </p>
                  </div>
                </div>
              </article>
            )}
          </div>
        )}
      </Reveal>

      {(conferenceConfig.description || conferenceConfig.website) && (
        <Reveal as="section" className="about-conference-section" aria-label="About this conference">
          <div className="about-conference-inner">
            <div className="about-conference-logo">
              <img
                src={conferenceConfig.logoUrl || elmLogo}
                alt={`${conferenceConfig.brand || "Conference"} logo`}
              />
            </div>
            <div className="about-conference-copy">
              <span className="eyebrow">About the conference</span>
              <h2>{conferenceConfig.brand || "Conference"}</h2>
              {conferenceConfig.description && (
                <p>{conferenceConfig.description}</p>
              )}
              {conferenceConfig.website && (
                <a
                  className="about-conference-link"
                  href={
                    conferenceConfig.website.startsWith("http")
                      ? conferenceConfig.website
                      : `https://${conferenceConfig.website}`
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit official website <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </div>
        </Reveal>
      )}

      <Reveal as="section" className="download-app-section">
        <div className="download-copy">
          <h2>Download the {conferenceConfig.brand} app</h2>
          <p>
            Scan the QR code to install the official mobile experience and
            access the schedule, speakers, announcements, and session details
            directly on your phone.
          </p>
        </div>

        <div className="download-qr-card">
          {conferenceConfig.mobileAppUrl ? (
            <>
              <div className="qr-code">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(conferenceConfig.mobileAppUrl)}`}
                  alt="QR code to download the mobile app"
                  style={{ width: 120, height: 120, background: "#fff", padding: 4, borderRadius: 8 }}
                />
              </div>
              <div className="qr-copy">
                <strong>Scan to download</strong>
                <span>Install the branded APK on your Android device</span>
              </div>
            </>
          ) : (
            <>
              <div className="qr-code">
                <svg
                  viewBox="0 0 120 120"
                  role="img"
                  aria-labelledby="qrTitle"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="120" height="120" fill="#fff" />
                  <rect x="8" y="8" width="32" height="32" fill="#111" />
                  <rect x="80" y="8" width="32" height="32" fill="#111" />
                  <rect x="8" y="80" width="32" height="32" fill="#111" />
                  <rect x="44" y="8" width="8" height="8" fill="#111" />
                  <rect x="60" y="8" width="8" height="8" fill="#111" />
                  <rect x="8" y="44" width="8" height="8" fill="#111" />
                  <rect x="8" y="60" width="8" height="8" fill="#111" />
                  <rect x="44" y="44" width="8" height="8" fill="#111" />
                  <rect x="56" y="44" width="8" height="8" fill="#111" />
                  <rect x="76" y="44" width="8" height="8" fill="#111" />
                  <rect x="92" y="44" width="8" height="8" fill="#111" />
                  <rect x="44" y="60" width="8" height="8" fill="#111" />
                  <rect x="60" y="60" width="8" height="8" fill="#111" />
                  <rect x="76" y="60" width="8" height="8" fill="#111" />
                  <rect x="92" y="60" width="8" height="8" fill="#111" />
                  <rect x="44" y="76" width="8" height="8" fill="#111" />
                  <rect x="60" y="76" width="8" height="8" fill="#111" />
                  <rect x="76" y="76" width="8" height="8" fill="#111" />
                  <rect x="92" y="76" width="8" height="8" fill="#111" />
                </svg>
              </div>
              <div className="qr-copy">
                <strong>Scan to download</strong>
                <span>Install the ElMoultaqa app for iOS and Android</span>
              </div>
            </>
          )}
        </div>
      </Reveal>
    </div>
  );
}
