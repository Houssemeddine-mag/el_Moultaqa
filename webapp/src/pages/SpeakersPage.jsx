import { useEffect, useState } from "react";
import { fetchKeynoteSpeakers } from "../services/localService";

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadSpeakers() {
      try {
        const data = await fetchKeynoteSpeakers();
        if (mounted) setSpeakers(data || []);
      } catch (err) {
        console.error("[SpeakersPage] Failed to load speakers:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadSpeakers();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="page-shell">
      <div className="card">
        <h1 className="section-title">Speakers</h1>
        <p>Meet the people shaping the conference experience.</p>
      </div>

      {loading ? (
        <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
          <p>Loading speakers...</p>
        </div>
      ) : speakers.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ color: "var(--text-muted, #888)" }}>No speakers have been added yet.</p>
        </div>
      ) : (
        <div className="list-grid">
          {speakers.map((speaker) => (
            <article key={speaker.id} className="card">
              {speaker.photo && (
                <img
                  src={speaker.photo}
                  alt={speaker.name}
                  style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", marginBottom: "0.75rem" }}
                />
              )}
              <h3>{speaker.name}</h3>
              {speaker.title && <p style={{ fontWeight: 600, margin: "0.25rem 0" }}>{speaker.title}</p>}
              {speaker.company && <p style={{ color: "var(--text-muted, #888)", fontSize: "0.9rem" }}>{speaker.company}</p>}
              {speaker.bio && (
                <p style={{ fontSize: "0.85rem", marginTop: "0.5rem", color: "var(--text-muted, #888)" }}>
                  {speaker.bio.length > 120 ? speaker.bio.slice(0, 120) + "…" : speaker.bio}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

