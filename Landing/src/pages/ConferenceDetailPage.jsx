import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useClerkSupabase } from "@global/supabase";

function formatCategory(str) {
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ConferenceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const supabase = useClerkSupabase();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data, error: rpcError } = await supabase.rpc("get_discovery_event", {
          p_slug: slug,
        });
        if (rpcError) throw rpcError;
        if (!data || data.length === 0) {
          setError("Conference not found or not yet published.");
          return;
        }
        setEvent(data[0]);
      } catch (err) {
        console.error("[ConferenceDetailPage] load error:", err);
        setError("Failed to load conference details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug, supabase]);

  if (loading) {
    return (
      <div className="discovery-shell">
        <div className="discovery-loading" style={{ padding: "80px 20px" }}>
          Loading conference details…
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="discovery-shell">
        <div className="discovery-empty" style={{ padding: "80px 20px" }}>
          <h3>Conference not found</h3>
          <p>{error || "This conference is not available."}</p>
          <button className="landing-cta" onClick={() => navigate("/discovery")}>
            Browse conferences
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="discovery-shell">
      <button className="detail-back" onClick={() => navigate("/discovery")}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to conferences
      </button>

      <div className="detail-card">
        <div className="detail-header">
          {event.logo_url ? (
            <div className="detail-logo">
              <img src={event.logo_url} alt={event.title} />
            </div>
          ) : (
            <div className="detail-logo detail-logo-fallback">
              <span>{event.title?.charAt(0) || "C"}</span>
            </div>
          )}
          <div className="detail-header-info">
            <div className="detail-title-row">
              <h1>{event.title}</h1>
              {event.is_completed && <span className="ended-badge-lg">Ended</span>}
            </div>
            <span className="detail-category">{formatCategory(event.category)}</span>
            <div className="detail-pricing-tag">
              {event.pricing === "paid" ? "Paid Event" : "Free Event"}
            </div>
          </div>
        </div>

        {event.description && (
          <div className="detail-section">
            <h3>About</h3>
            <p className="detail-description">{event.description}</p>
          </div>
        )}

        <div className="detail-section">
          <h3>Date & Time</h3>
          <div className="detail-info-grid">
            <div className="detail-info-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <div>
                <strong>Start</strong>
                <span>{event.start_date}{event.start_time ? ` at ${event.start_time}` : ""}</span>
              </div>
            </div>
            <div className="detail-info-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <div>
                <strong>End</strong>
                <span>{event.end_date}</span>
              </div>
            </div>
            {event.location && (
              <div className="detail-info-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div>
                  <strong>Location</strong>
                  <span>{event.location}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="detail-section">
          <h3>Pricing</h3>
          <p className="detail-pricing">
            {event.pricing === "paid"
              ? "This conference requires a paid ticket."
              : "This conference is free to attend."}
          </p>
        </div>

        <div className="detail-actions">
          {event.is_completed ? (
            <button className="secondary-button" disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
              Conference has ended
            </button>
          ) : (
            <a
              href={event.webapp_url}
              className="landing-cta"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 32px",
              }}
            >
              Access Webapp
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
