import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const PUBLIC_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const PUBLIC_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

import {
  SearchIcon,
  XIcon,
  ChevronRightIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
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

function formatShortDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getStatus(event) {
  if (event.is_completed) return { label: "Ended", type: "ended" };
  if (event.is_ongoing) return { label: "Live", type: "live" };
  return { label: "Upcoming", type: "upcoming" };
}

function ConferenceCard({ event, onClick }) {
  const status = getStatus(event);
  const IconComp = CATEGORY_ICONS[event.category] || GlobeIcon;
  return (
    <button className="disc-card" onClick={() => onClick(event.org_slug)}>
      <div className="disc-card-cover">
        {event.logo_url ? (
          <img src={event.logo_url} alt="" className="disc-card-cover-img" />
        ) : (
          <div className="disc-card-cover-fallback">
            <span className="disc-card-cover-letter">
              {event.title?.charAt(0) || "C"}
            </span>
          </div>
        )}
      </div>
      <div className="disc-card-body">
        <div className="disc-card-top">
          <span className={`disc-card-badge disc-card-badge--${status.type}`}>
            {status.type === "live" && <span className="disc-live-dot" />}
            {status.label}
          </span>
          {event.pricing === "free" && (
            <span className="disc-card-badge disc-card-badge--free">Free</span>
          )}
        </div>
        <div className="disc-card-category">
          <IconComp size={13} />
          <span>{formatCategory(event.category)}</span>
        </div>
        <h3 className="disc-card-title">
          {event.title}
          {event.org_name && <span className="disc-card-org"> &middot; {event.org_name}</span>}
        </h3>
        {event.description && (
          <p className="disc-card-desc">
            {event.description.length > 120
              ? event.description.slice(0, 120) + "\u2026"
              : event.description}
          </p>
        )}
        <div className="disc-card-meta">
          <div className="disc-card-meta-item">
            <CalendarIcon size={13} />
            <span>{formatShortDate(event.start_date)}{event.end_date ? ` \u2014 ${formatShortDate(event.end_date)}` : ""}</span>
          </div>
          {event.start_time && (
            <div className="disc-card-meta-item">
              <ClockIcon size={13} />
              <span>{event.start_time}</span>
            </div>
          )}
          {event.location && (
            <div className="disc-card-meta-item">
              <MapPinIcon size={13} />
              <span>{event.location}</span>
            </div>
          )}
        </div>
      </div>
      <div className="disc-card-footer">
        <span className="disc-card-action">
          {status.type === "live" ? "Join Live" : status.type === "ended" ? "View Recap" : "View Details"}
        </span>
        <ChevronRightIcon size={14} />
      </div>
    </button>
  );
}

function LiveRibbonCard({ event, onClick }) {
  const IconComp = CATEGORY_ICONS[event.category] || GlobeIcon;
  return (
    <button className="disc-r-card" onClick={() => onClick(event.org_slug)}>
      <div className="disc-r-cover">
        {event.logo_url ? (
          <img src={event.logo_url} alt="" className="disc-r-cover-img" />
        ) : (
          <div className="disc-r-cover-fallback">
            <span className="disc-r-cover-letter">
              {event.title?.charAt(0) || "C"}
            </span>
          </div>
        )}
        <div className="disc-r-live-badge">
          <span className="disc-live-dot" />
          LIVE
        </div>
      </div>
      <div className="disc-r-body">
        <div className="disc-r-category">
          <IconComp size={11} />
          <span>{formatCategory(event.category)}</span>
        </div>
        <h3 className="disc-r-title">{event.title}</h3>
        {event.org_name && (
          <span className="disc-r-org">{event.org_name}</span>
        )}
        <div className="disc-r-meta">
          {event.location && (
            <div className="disc-r-meta-item">
              <MapPinIcon size={11} />
              <span>{event.location}</span>
            </div>
          )}
          {event.start_time && (
            <div className="disc-r-meta-item">
              <ClockIcon size={11} />
              <span>{event.start_time}</span>
            </div>
          )}
        </div>
        <span className="disc-r-action">
          Join Live <ChevronRightIcon size={12} />
        </span>
      </div>
    </button>
  );
}

function FilterChips({ label, options, active, onSelect, renderChip }) {
  return (
    <div className="disc-filter-row">
      <span className="disc-filter-row-label">{label}</span>
      <div className="disc-filter-chips">
        <button
          className={`disc-filter-chip${!active ? " active" : ""}`}
          onClick={() => onSelect(null)}
        >
          All
        </button>
        {options.map((val) => (
          <button
            key={val}
            className={`disc-filter-chip${active === val ? " active" : ""}`}
            onClick={() => onSelect(active === val ? null : val)}
          >
            {renderChip ? renderChip(val) : val}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DiscoveryPage() {
  const navigate = useNavigate();
  const publicSupabase = useMemo(() => {
    if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) return null;
    return createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
  }, []);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeLocation, setActiveLocation] = useState(null);

  useEffect(() => {
    if (!publicSupabase) {
      console.error("[DiscoveryPage] Missing VITE_SUPABASE_URL/ANON_KEY — cannot load discovery");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const [{ data: eventsData, error: evErr }, { data: catsData, error: catErr }] = await Promise.all([
          publicSupabase.rpc("list_discovery_events"),
          publicSupabase.rpc("list_discovery_categories"),
        ]);
        if (evErr) console.error("[DiscoveryPage] list_discovery_events error:", evErr);
        if (catErr) console.error("[DiscoveryPage] list_discovery_categories error:", catErr);
        const items = eventsData || [];
        if (items.length === 0) {
          console.warn("[DiscoveryPage] 0 events returned — check public.discovery_events: is_super_enabled=true AND is_org_published=true AND is_super_blocked=false required. Also verify SuperAdmin enabled the org and Admin published the card.");
        }
        setEvents(items);
        setCategories(catsData?.map((c) => c.category) || []);
      } catch (err) {
        console.error("[DiscoveryPage] load error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [publicSupabase]);

  const locations = [...new Set(events.map((e) => e.location).filter(Boolean))].sort();
  const liveEvents = events.filter((e) => e.is_ongoing);

  const nonLive = events.filter((e) => !e.is_ongoing);
  const filtered = nonLive.filter((e) => {
    if (search) {
      const q = search.toLowerCase();
      if (!e.title?.toLowerCase().includes(q) && !e.org_name?.toLowerCase().includes(q) && !formatCategory(e.category).toLowerCase().includes(q) && !e.location?.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (activeCategory && e.category !== activeCategory) {
      return false;
    }
    if (activeLocation && e.location !== activeLocation) {
      return false;
    }
    return true;
  });

  const filteredUpcoming = filtered.filter((e) => !e.is_completed);
  const filteredEnded = filtered.filter((e) => e.is_completed);
  const featured = filteredUpcoming.slice(0, 3);

  const handleCardClick = (slug) => navigate(`/discovery/${slug}`);

  const hasActiveFilters = activeCategory || activeLocation || search;

  return (
    <div className="disc-shell">
      <section className="disc-hero">
        <div className="disc-hero-bg" />
        <div className="disc-hero-circle disc-hero-circle-1" />
        <div className="disc-hero-circle disc-hero-circle-2" />
        <div className="disc-hero-circle disc-hero-circle-3" />
        <div className="disc-hero-circle disc-hero-circle-4" />
        <div className="disc-hero-circle disc-hero-circle-5" />
        <div className="disc-hero-content">
          <h1 className="disc-hero-title">
            <span className="disc-hero-word" style={{animationDelay: '0s'}}>Discover</span>{' '}
            <span className="disc-hero-word" style={{animationDelay: '0.12s'}}>Conferences</span>
          </h1>
          <div className="disc-hero-accent" />
          <p className="disc-hero-sub">
            Academic and research conferences across Algeria and beyond
          </p>

          <div className="disc-hero-search-wrap">
            <div className="disc-hero-search">
              <SearchIcon size={18} className="disc-hero-search-icon" />
              <input
                type="text"
                placeholder="Search conferences, topics, or organizations\u2026"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="disc-hero-search-input"
              />
              {search && (
                <button className="disc-hero-search-clear" onClick={() => setSearch("")}>
                  <XIcon size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="disc-hero-stats">
            <div className="disc-hero-stat">
              <strong>{events.length}</strong>
              <span>Conferences</span>
            </div>
            <div className="disc-hero-stat-sep" />
            <div className="disc-hero-stat">
              <strong>{new Set(events.map((e) => e.category)).size}</strong>
              <span>Categories</span>
            </div>
            <div className="disc-hero-stat-sep" />
            <div className="disc-hero-stat">
              <strong>{liveEvents.length}</strong>
              <span>Active Now</span>
            </div>
          </div>
        </div>
      </section>

      <div className="disc-content">
        {loading ? (
          <div className="disc-loading">
            <div className="disc-loading-spinner" />
            <span>Loading conferences\u2026</span>
          </div>
        ) : (
          <>
            {liveEvents.length > 0 && (
              <section className="disc-ribbon-section">
                <div className="disc-section-header">
                  <h2>
                    <span className="disc-live-dot" /> Live Now
                  </h2>
                  <span className="disc-section-count">{liveEvents.length} live</span>
                </div>
                <div className="disc-ribbon-scroll">
                  <div className="disc-ribbon-track">
                    {liveEvents.map((event) => (
                      <LiveRibbonCard key={event.id} event={event} onClick={handleCardClick} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            <div className="disc-filters-bar">
              <div className="disc-filter-group">
                <FilterChips
                  label="Category"
                  options={categories.length > 0 ? categories : ["computer_science", "technology", "medicine", "engineering", "education", "economics", "arts", "other"]}
                  active={activeCategory}
                  onSelect={setActiveCategory}
                  renderChip={(cat) => {
                    const IconComp = CATEGORY_ICONS[cat] || GlobeIcon;
                    return <><IconComp size={15} /><span>{formatCategory(cat)}</span></>;
                  }}
                />
                {locations.length > 0 && (
                  <FilterChips
                    label="Region"
                    options={locations}
                    active={activeLocation}
                    onSelect={setActiveLocation}
                    renderChip={(loc) => <><MapPinIcon size={14} /><span>{loc}</span></>}
                  />
                )}
              </div>
            </div>

            {featured.length > 0 && !hasActiveFilters && (
              <section className="disc-featured-section">
                <div className="disc-section-header">
                  <h2>Upcoming</h2>
                  <span className="disc-section-count">{featured.length} conference{featured.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="disc-featured-grid">
                  {featured.map((event) => {
                    const StatusIcon = CATEGORY_ICONS[event.category] || GlobeIcon;
                    return (
                      <button className="disc-featured-card" onClick={() => handleCardClick(event.org_slug)} key={event.id}>
                        <div className="disc-featured-cover">
                          {event.logo_url ? (
                            <img src={event.logo_url} alt="" className="disc-featured-cover-img" />
                          ) : (
                            <div className="disc-featured-cover-fallback">
                              <span className="disc-featured-cover-letter">
                                {event.title?.charAt(0) || "C"}
                              </span>
                            </div>
                          )}
                          <div className="disc-featured-cover-overlay" />
                          <div className="disc-featured-content">
                            <div className="disc-featured-top">
                              <span className="disc-card-badge disc-card-badge--upcoming">Upcoming</span>
                              {event.pricing === "free" && (
                                <span className="disc-card-badge disc-card-badge--free">Free</span>
                              )}
                            </div>
                            <div className="disc-featured-bottom">
                              <div className="disc-featured-category">
                                <StatusIcon size={13} />
                                <span>{formatCategory(event.category)}</span>
                              </div>
                              <h3 className="disc-featured-title">{event.title}</h3>
                              {event.org_name && (
                                <span className="disc-featured-org">by {event.org_name}</span>
                              )}
                              <div className="disc-featured-meta">
                                <span>{formatShortDate(event.start_date)}{event.end_date ? ` \u2014 ${formatShortDate(event.end_date)}` : ""}</span>
                                {event.location && (
                                  <>
                                    <span className="disc-meta-sep">|</span>
                                    <span>{event.location}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            <section className="disc-all-section">
              <div className="disc-section-header">
                <h2>
                  {hasActiveFilters
                    ? "Results"
                    : "All Conferences"}
                </h2>
                <span className="disc-section-count">{filtered.length} conference{filtered.length !== 1 ? "s" : ""}</span>
              </div>

              {filtered.length === 0 ? (
                <div className="disc-empty" style={{ padding: "40px 20px" }}>
                  <SearchIcon size={36} className="disc-empty-icon" />
                  <h3>No conferences found</h3>
                  <p>Try adjusting your search or filters.</p>
                  <button className="disc-empty-btn" onClick={() => { setSearch(""); setActiveCategory(null); setActiveLocation(null); }}>
                    Clear all filters
                  </button>
                </div>
              ) : (
                <>
                  {filteredUpcoming.length > 0 && (
                    <>
                      {hasActiveFilters && (
                        <h3 className="disc-subsection-label">Upcoming</h3>
                      )}
                      <div className="disc-grid">
                        {filteredUpcoming.map((event) => (
                          <ConferenceCard key={event.id} event={event} onClick={handleCardClick} />
                        ))}
                      </div>
                    </>
                  )}
                  {filteredEnded.length > 0 && (
                    <>
                      {hasActiveFilters && (
                        <h3 className="disc-subsection-label" style={filteredUpcoming.length > 0 ? { marginTop: "28px" } : {}}>Past</h3>
                      )}
                      <div className="disc-grid">
                        {filteredEnded.map((event) => (
                          <ConferenceCard key={event.id} event={event} onClick={handleCardClick} />
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
