import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClerkSupabase } from "@global/supabase";

const CATEGORIES = [
  "computer_science", "agriculture", "physics", "mathematics",
  "medicine", "engineering", "social_sciences", "arts", "law",
  "economics", "literature", "biology", "chemistry", "education",
  "technology", "philosophy", "other",
];

function formatCategory(str) {
  return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function DiscoveryPage() {
  const navigate = useNavigate();
  const supabase = useClerkSupabase();
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [{ data: eventsData }, { data: catsData }] = await Promise.all([
          supabase.rpc("list_discovery_events"),
          supabase.rpc("list_discovery_categories"),
        ]);
        setEvents(eventsData || []);
        setCategories(catsData?.map((c) => c.category) || []);
      } catch (err) {
        console.error("[DiscoveryPage] load error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [supabase]);

  const filtered = events.filter((e) => {
    if (search) {
      const q = search.toLowerCase();
      if (!e.title?.toLowerCase().includes(q) && !e.org_name?.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (activeCategory) {
      return e.category === activeCategory;
    }
    return true;
  });

  return (
    <div className="discovery-shell">
      {/* Hero */}
      <div className="discovery-hero">
        <h1>Discover Conferences</h1>
        <p>Browse academic and research conferences across Algeria.</p>
        <div className="discovery-search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search conferences..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="discovery-categories">
        <button
          className={`category-chip ${!activeCategory ? "active" : ""}`}
          onClick={() => setActiveCategory(null)}
        >
          All
        </button>
        {(categories.length > 0 ? categories : CATEGORIES).map((cat) => (
          <button
            key={cat}
            className={`category-chip ${activeCategory === cat ? "active" : ""}`}
            onClick={() =>
              setActiveCategory((prev) => (prev === cat ? null : cat))
            }
          >
            {formatCategory(cat)}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="discovery-loading">Loading conferences…</div>
      ) : filtered.length === 0 ? (
        <div className="discovery-empty">
          <h3>No conferences found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="discovery-grid">
          {filtered.map((event) => (
            <button
              key={event.id}
              className="discovery-card"
              onClick={() => navigate(`/discovery/${event.org_slug}`)}
            >
              {event.logo_url ? (
                <div className="discovery-card-logo">
                  <img src={event.logo_url} alt={event.title} />
                </div>
              ) : (
                <div className="discovery-card-logo discovery-card-logo-fallback">
                  <span>{event.title?.charAt(0) || "C"}</span>
                </div>
              )}
              <div className="discovery-card-body">
                <div className="discovery-card-top">
                  <h3>{event.title}</h3>
                  <div className="discovery-card-badges">
                    {event.is_ongoing && <span className="live-badge-sm">LIVE</span>}
                    {event.is_completed && <span className="ended-badge-sm">Ended</span>}
                    <span className="pricing-badge-sm">
                      {event.pricing === "paid" ? "Paid" : "Free"}
                    </span>
                  </div>
                </div>
                <span className="discovery-card-category">
                  {formatCategory(event.category)}
                </span>
                <div className="discovery-card-meta">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>{event.start_date} – {event.end_date}</span>
                </div>
                {event.location && (
                  <div className="discovery-card-meta">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
