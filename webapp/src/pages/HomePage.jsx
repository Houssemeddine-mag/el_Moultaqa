import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/HomePage.css";
import elmLogo from "@global/logo.png";
import KeynoteCard from "../components/KeynoteCard.jsx";
import { fetchKeynoteSpeakers, fetchSponsors } from "../services/localService";
import { useConferenceConfig } from "../context/ConferenceContext.jsx";

export default function HomePage() {
  const navigate = useNavigate();
  const conferenceConfig = useConferenceConfig();
  const [keynotes, setKeynotes] = useState([]);
  const [loadingKeynotes, setLoadingKeynotes] = useState(true);
  const [sponsors, setSponsors] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadKeynotes() {
      const speakers = await fetchKeynoteSpeakers();
      if (!active) return;
      setKeynotes(speakers);
      setLoadingKeynotes(false);
    }

    loadKeynotes();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadSponsors() {
      try {
        const list = await fetchSponsors();
        if (!active) return;

        setSponsors(
          list
            .filter(
              (sponsor) =>
                sponsor.logoData || sponsor.image || sponsor.imageData,
            )
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((sponsor) => ({
              id: sponsor.id,
              alt: sponsor.name || "Sponsor",
              src: sponsor.logoData || sponsor.image || sponsor.imageData,
            })),
        );
      } catch (error) {
        console.error("Failed to load sponsors", error);
        setSponsors([]);
      }
    }

    loadSponsors();

    const handleStorage = (event) => {
      if (event.key === "elm_sponsors") {
        loadSponsors();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      active = false;
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [keynotes.length]);

  useEffect(() => {
    if (keynotes.length <= 1) return undefined;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % keynotes.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [keynotes.length]);

  const conferenceSponsor = {
    id: "conference-brand",
    alt: conferenceConfig.name || conferenceConfig.brand || "Conference",
    src: conferenceConfig.logoUrl || elmLogo,
  };

  return (
    <div className="page-shell home-page">
      <section className="home-upper">
        <div className="home-hero">
          <div className="hero-copy">
            {conferenceConfig.name && (
              <span className="eyebrow">{conferenceConfig.name}</span>
            )}
            <h1>{conferenceConfig.brand || "Conference"}</h1>
            <p>
              {conferenceConfig.description ||
                "Welcome to the official conference experience."}
            </p>
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
            <div className="hero-actions">
              <button
                className="primary-button"
                type="button"
                onClick={() => navigate(`/c/${conferenceConfig.id || "demo"}/program`)}
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

      {/* partner logos removed — using ElMoultaqa brand only */}

      <section className="sponsor-ribbon">
        <div className="sponsor-header">
          <div>
            <span>Sponsors</span>
            <h3>Official sponsor logos</h3>
          </div>
        </div>
        <div className="sponsor-track">
          {[conferenceSponsor, ...sponsors]
            .concat(conferenceSponsor, ...sponsors)
            .map((sponsor, index) => (
              <div
                key={`${sponsor.id || sponsor.alt}-${index}`}
                className="sponsor-item"
              >
                <img src={sponsor.src} alt={sponsor.alt} />
              </div>
            ))}
        </div>
      </section>

      <section id="keynote-speakers" className="home-info-grid keynote-section">
        <div className="section-header">
          <div>
            <span>Keynote speakers</span>
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
          <div className="keynote-carousel">
            {keynotes.length > 1 ? (
              <>
                <button
                  type="button"
                  className="keynote-arrow keynote-arrow-left"
                  aria-label="Previous keynote speakers"
                  onClick={() =>
                    setActiveIndex(
                      (index) =>
                        (index - 1 + keynotes.length) % keynotes.length,
                    )
                  }
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="keynote-arrow keynote-arrow-right"
                  aria-label="Next keynote speakers"
                  onClick={() =>
                    setActiveIndex((index) => (index + 1) % keynotes.length)
                  }
                >
                  ›
                </button>
              </>
            ) : null}

            <div className="keynote-carousel-viewport">
              <div
                className="keynote-carousel-track"
                style={{ transform: `translateX(-${activeIndex * 50}%)` }}
              >
                {keynotes.map((speaker) => (
                  <div key={speaker.id} className="keynote-carousel-item">
                    <KeynoteCard
                      speaker={speaker}
                      onReadBio={() => setSelectedSpeaker(speaker)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedSpeaker ? (
          <div className="keynote-bio-modal" role="dialog" aria-modal="true">
            <div className="keynote-bio-card">
              <button
                className="keynote-bio-close"
                type="button"
                onClick={() => setSelectedSpeaker(null)}
                aria-label="Close biography dialog"
              >
                ×
              </button>
              <div className="keynote-bio-image">
                <div className="keynote-speaker-avatar">
                  {selectedSpeaker.imageData || selectedSpeaker.image ? (
                    <img
                      src={
                        (
                          selectedSpeaker.imageData || selectedSpeaker.image
                        ).startsWith("data:")
                          ? selectedSpeaker.imageData || selectedSpeaker.image
                          : `data:image/jpeg;base64,${selectedSpeaker.imageData || selectedSpeaker.image}`
                      }
                      alt={selectedSpeaker.name || "Speaker image"}
                    />
                  ) : (
                    <span>
                      {(selectedSpeaker.name || "Speaker")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <div className="keynote-bio-content">
                <h2>{selectedSpeaker.name || "Unknown Speaker"}</h2>
                {selectedSpeaker.title ? (
                  <p className="keynote-bio-title">{selectedSpeaker.title}</p>
                ) : null}
                {selectedSpeaker.institution ? (
                  <div className="keynote-bio-institution">
                    {selectedSpeaker.institution}
                  </div>
                ) : null}
                <div className="keynote-bio-section">
                  <span>About</span>
                  <p>
                    {selectedSpeaker.biography ||
                      selectedSpeaker.bio ||
                      selectedSpeaker.keynoteDescription ||
                      "No biography available."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      <section className="download-app-section">
        <div className="download-copy">
          <span>Mobile app</span>
          <h2>Download the ElMoultaqa conference app</h2>
          <p>
            Scan the QR code to install the official mobile experience and
            access the schedule, speakers, announcements, and session details
            directly on your phone.
          </p>
          <div className="store-buttons">
            <a href="#" className="store-button">
              App Store
            </a>
            <a href="#" className="store-button">
              Google Play
            </a>
          </div>
        </div>

        <div className="download-qr-card">
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
        </div>
      </section>
    </div>
  );
}
