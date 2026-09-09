import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const PUBLIC_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const PUBLIC_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const WEBAPP_URL = import.meta.env.VITE_WEBAPP_URL || "";

import {
  ChevronRightIcon,
  CalendarIcon,
  MapPinIcon,
  ShieldIcon,
  TicketIcon,
  LinkIcon,
  TwitterIcon,
  LinkedinIcon,
  FacebookIcon,
  InstagramIcon,
  MessageCircleIcon,
  ExternalLinkIcon,
  SearchIcon,
  GlobeIcon,
  CodeIcon,
  CpuIcon,
  HeartIcon,
  SettingsIcon,
  FlaskIcon,
  LeafIcon,
  BookOpenIcon,
  BarChartIcon,
  UsersIcon,
  PaletteIcon,
  ScaleIcon,
  DnaIcon,
  SigmaIcon,
  AtomIcon,
  BookIcon,
  BrainIcon,
} from "../icons.jsx";

const CATEGORY_ICONS = {
  computer_science: CodeIcon,
  technology: CpuIcon,
  medicine: HeartIcon,
  engineering: SettingsIcon,
  physics: AtomIcon,
  mathematics: SigmaIcon,
  biology: DnaIcon,
  chemistry: FlaskIcon,
  agriculture: LeafIcon,
  education: BookOpenIcon,
  economics: BarChartIcon,
  social_sciences: UsersIcon,
  arts: PaletteIcon,
  law: ScaleIcon,
  literature: BookIcon,
  philosophy: BrainIcon,
  other: GlobeIcon,
};

function formatCategory(str) {
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatShortDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function resolveWebappUrl(path) {
  if (!path) return "#";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (WEBAPP_URL) return `${WEBAPP_URL.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
  return path;
}

export default function ConferenceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const publicSupabase = useMemo(() => {
    if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) return null;
    return createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
  }, []);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!publicSupabase) {
      setError("Missing Supabase configuration.");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const { data, error: rpcError } = await publicSupabase.rpc("get_discovery_event", {
          p_slug: slug,
        });
        if (rpcError) throw rpcError;
        if (!data || data.length === 0) {
          setError("Conference not found or not yet published. SuperAdmin must enable discovery (is_super_enabled) and org admin must publish (is_org_published) — both required.");
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
  }, [slug, publicSupabase]);

  if (loading) {
    return (
      <div className="disc-shell">
        <div className="disc-loading" style={{ padding: "120px 20px" }}>
          <div className="disc-loading-spinner" />
          <span>Loading conference details…</span>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="disc-shell">
        <div className="disc-empty" style={{ padding: "120px 20px" }}>
          <SearchIcon size={48} className="disc-empty-icon" />
          <h3>Conference not found</h3>
          <p>{error || "This conference is not available."}</p>
          <button className="disc-empty-btn" onClick={() => navigate("/discovery")}>
            Browse conferences
          </button>
        </div>
      </div>
    );
  }

  const CategoryIconComp = CATEGORY_ICONS[event.category] || GlobeIcon;
  const isLive = event.is_ongoing;
  const isEnded = event.is_completed;

  return (
    <div className="detail-shell">
      <div className="detail-nav">
        <button className="detail-nav-back" onClick={() => navigate("/discovery")}>
          <ChevronRightIcon size={18} style={{ transform: "rotate(180deg)" }} />
          Back to Discover
        </button>
      </div>

      <div className="detail-cover-wrap">
        <div className="detail-cover">
          {event.logo_url ? (
            <img src={event.logo_url} alt="" className="detail-cover-img" />
          ) : (
            <div className="detail-cover-fallback">
              <div className="detail-cover-gradient" />
              <span className="detail-cover-letter">
                {event.title?.charAt(0) || "C"}
              </span>
            </div>
          )}
          <div className="detail-cover-overlay" />
          <div className="detail-cover-content">
            <div className="detail-cover-badges">
              <span className={`detail-badge detail-badge--${isLive ? "live" : isEnded ? "ended" : "upcoming"}`}>
                {isLive && <span className="disc-live-dot" />}
                {isLive ? "Live Now" : isEnded ? "Ended" : "Upcoming"}
              </span>
              <span className={`detail-badge detail-badge--${event.pricing}`}>
                {event.pricing === "free" ? "Free" : "Paid"}
              </span>
            </div>

            <div className="detail-cover-category">
              <CategoryIconComp size={14} />
              <span>{formatCategory(event.category)}</span>
            </div>

            <h1 className="detail-cover-title">{event.title}</h1>

            {event.org_name && (
              <span className="detail-cover-org">Hosted by {event.org_name}</span>
            )}

            <div className="detail-cover-info">
              <div className="detail-cover-info-item">
                <CalendarIcon size={14} />
                <span>{formatShortDate(event.start_date)}{event.end_date ? ` — ${formatShortDate(event.end_date)}` : ""}</span>
              </div>
              {event.location && (
                <div className="detail-cover-info-item">
                  <MapPinIcon size={14} />
                  <span>{event.location}</span>
                </div>
              )}
            </div>

            <div className="detail-cover-action">
              {isEnded ? (
                <span className="detail-cover-action-disabled">Conference has ended</span>
              ) : (
                <a
                  href={resolveWebappUrl(event.webapp_url)}
                  className="detail-cover-action-btn"
                  target="_blank"
                  rel="noreferrer"
                >
                  {isLive ? "Join Live Now" : "Access Webapp"}
                  <ChevronRightIcon size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="detail-body">
        <div className="detail-layout">
          <div className="detail-main">
            {event.description && (
              <section className="detail-section-card">
                <h2 className="detail-section-title">About</h2>
                <p className="detail-description">{event.description}</p>
              </section>
            )}

            <section className="detail-section-card">
              <h2 className="detail-section-title">Date & Location</h2>
              <div className="detail-info-grid">
                <div className="detail-info-item">
                  <div className="detail-info-icon">
                    <CalendarIcon size={18} />
                  </div>
                  <div>
                    <span className="detail-info-label">Start Date</span>
                    <strong>{formatDate(event.start_date)}</strong>
                  </div>
                </div>
                <div className="detail-info-item">
                  <div className="detail-info-icon">
                    <CalendarIcon size={18} />
                  </div>
                  <div>
                    <span className="detail-info-label">End Date</span>
                    <strong>{formatDate(event.end_date)}</strong>
                  </div>
                </div>
                {event.location && (
                  <div className="detail-info-item detail-info-item--full">
                    <div className="detail-info-icon">
                      <MapPinIcon size={18} />
                    </div>
                    <div>
                      <span className="detail-info-label">Location</span>
                      <strong>{event.location}</strong>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="detail-section-card">
              <h2 className="detail-section-title">Pricing</h2>
              <div className="detail-pricing-card">
                <div className="detail-pricing-icon">
                  {event.pricing === "free" ? (
                    <ShieldIcon size={22} />
                  ) : (
                    <TicketIcon size={22} />
                  )}
                </div>
                <div>
                  <strong className="detail-pricing-label">
                    {event.pricing === "paid" ? "Paid Event" : "Free to Attend"}
                  </strong>
                  <p className="detail-pricing-desc">
                    {event.pricing === "paid"
                      ? "This conference requires a paid ticket for attendance."
                      : "No registration fee required. Open to all attendees."}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside className="detail-sidebar">
            <div className="detail-sidebar-card">
              <div className="detail-sidebar-actions">
                {event.official_website_url ? (
                  <a
                    href={event.official_website_url}
                    className="detail-sidebar-btn detail-sidebar-btn--primary"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Official Website
                    <ExternalLinkIcon size={16} />
                  </a>
                ) : isEnded ? (
                  <button className="detail-sidebar-btn detail-sidebar-btn--disabled" disabled>
                    Conference has ended
                  </button>
                ) : (
                  <span className="detail-sidebar-btn detail-sidebar-btn--disabled" style={{ opacity: 0.5 }}>
                    No website set
                  </span>
                )}
              </div>

              {event.social_links && Object.entries(event.social_links).some(([, v]) => v?.active) && (
                <div className="detail-sidebar-share" style={{ marginTop: 16 }}>
                  <span>Follow</span>
                  <div className="detail-sidebar-share-links">
                    {event.social_links?.linkedin?.active && (
                      <a href={event.social_links.linkedin.url} target="_blank" rel="noreferrer" title="LinkedIn">
                        <LinkedinIcon size={16} />
                      </a>
                    )}
                    {event.social_links?.facebook?.active && (
                      <a href={event.social_links.facebook.url} target="_blank" rel="noreferrer" title="Facebook">
                        <FacebookIcon size={16} />
                      </a>
                    )}
                    {event.social_links?.instagram?.active && (
                      <a href={event.social_links.instagram.url} target="_blank" rel="noreferrer" title="Instagram">
                        <InstagramIcon size={16} />
                      </a>
                    )}
                    {event.social_links?.whatsapp?.active && (
                      <a href={event.social_links.whatsapp.url} target="_blank" rel="noreferrer" title="WhatsApp">
                        <MessageCircleIcon size={16} />
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="detail-sidebar-share">
                <span>Share</span>
                <div className="detail-sidebar-share-links">
                  <button
                    title="Share on Twitter"
                    onClick={() => window.open(
                      `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${event.title} on ElMoultaqa!`)}&url=${encodeURIComponent(window.location.href)}`,
                      "_blank"
                    )}
                  >
                    <TwitterIcon size={16} />
                  </button>
                  <button
                    title="Share on LinkedIn"
                    onClick={() => window.open(
                      `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
                      "_blank"
                    )}
                  >
                    <LinkedinIcon size={16} />
                  </button>
                  <button
                    title="Copy link"
                    onClick={() => { navigator.clipboard.writeText(window.location.href); }}
                  >
                    <LinkIcon size={16} />
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
