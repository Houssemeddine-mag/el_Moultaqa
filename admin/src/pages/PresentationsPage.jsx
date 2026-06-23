import { useMemo, useState, useEffect } from "react";
import backend from "../backend.js";

const PresentationsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [selectedPresentation, setSelectedPresentation] = useState(null);
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const sessions = await backend.getPrograms();
        // Map sessions to the presentation shape expected by this page
        const mapped = (sessions || []).map((s) => ({
          id: s.id,
          title: s.title || "Untitled",
          presenter: s.keynote?.name || "TBD",
          affiliation: s.keynote?.company || "",
          track: s.type || "session",
          programDate: s.date || "",
          start: s.start || "",
          end: s.end || "",
          room: s.room || "",
          status: "scheduled",
          resume: s.keynoteDescription || "",
          isKeynote: s.type === "keynote",
          presentationRating: null,
          presenterRating: null,
          commentCount: 0,
          comments: [],
        }));
        if (active) setPresentations(mapped);
      } catch (err) {
        console.error("[PresentationsPage] Failed to load:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const filteredPresentations = useMemo(() => {
    const filtered = presentations.filter((presentation) => {
      const query = searchTerm.toLowerCase();
      return (
        (presentation.title || "").toLowerCase().includes(query) ||
        (presentation.presenter || "").toLowerCase().includes(query) ||
        (presentation.affiliation || "").toLowerCase().includes(query) ||
        (presentation.track || "").toLowerCase().includes(query)
      );
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "presenter":
          return a.presenter.localeCompare(b.presenter);
        case "date":
          return (
            a.programDate.localeCompare(b.programDate) ||
            a.start.localeCompare(b.start)
          );
        case "rating":
        default:
          return (b.presentationRating || 0) - (a.presentationRating || 0);
      }
    });
  }, [searchTerm, sortBy]);

  const formatDate = (value) => {
    if (!value) return "TBD";
    return new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    if (!rating) {
      return <span className="rating-empty">No ratings</span>;
    }

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;

    for (let i = 0; i < fullStars; i += 1) {
      stars.push(
        <span key={`star-${i}`} className="star filled">
          ★
        </span>,
      );
    }

    if (hasHalf) {
      stars.push(
        <span key="star-half" className="star half">
          ☆
        </span>,
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i += 1) {
      stars.push(
        <span key={`star-empty-${i}`} className="star empty">
          ☆
        </span>,
      );
    }

    return (
      <span className="rating-stars">
        {stars}
        <span className="rating-value">{rating.toFixed(1)}</span>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="page-card presentations-page">
        <div className="page-header">
          <div>
            <h1>Presentations Management</h1>
            <p className="subtitle">Browse presentations, sort by rating, and inspect session details.</p>
          </div>
        </div>
        <div style={{ padding: "40px", textAlign: "center" }}>Loading sessions...</div>
      </div>
    );
  }

  return (
    <div className="page-card presentations-page">
      <div className="page-header">
        <div>
          <h1>Presentations Management</h1>
          <p className="subtitle">
            Browse presentations, sort by rating, and inspect session details.
          </p>
        </div>
      </div>

      <div className="controls-row">
        <div className="search-box">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search presentations..."
          />
        </div>
        <div className="sort-box">
          <label htmlFor="presentations-sort">Sort by</label>
          <select
            id="presentations-sort"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="rating">Highest Rated</option>
            <option value="title">Title A-Z</option>
            <option value="presenter">Presenter A-Z</option>
            <option value="date">Date</option>
          </select>
        </div>
      </div>

      <div className="presentations-grid">
        <div className="presentations-list">
          <h2>Presentations ({filteredPresentations.length})</h2>
          <div className="presentation-list-cards">
            {filteredPresentations.map((presentation) => (
              <button
                type="button"
                key={presentation.id}
                className={`presentation-card ${
                  selectedPresentation?.id === presentation.id ? "selected" : ""
                }`}
                onClick={() => setSelectedPresentation(presentation)}
              >
                <div className="presentation-card-top">
                  <div>
                    <h3>{presentation.title}</h3>
                    <p>
                      {presentation.presenter} • {presentation.affiliation}
                    </p>
                  </div>
                  <span
                    className={`status-pill status-${presentation.status.replace(/\s+/g, "-").toLowerCase()}`}
                  >
                    {presentation.status}
                  </span>
                </div>

                <div className="presentation-meta">
                  <span>{presentation.track}</span>
                  <span>{formatDate(presentation.programDate)}</span>
                  <span>
                    {presentation.start} - {presentation.end}
                  </span>
                </div>

                <div className="presentation-rating">
                  {renderStars(presentation.presentationRating)}
                  <span>{presentation.commentCount} comments</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="presentation-details-card">
          {selectedPresentation ? (
            <div className="presentation-details">
              <div className="presentation-details-header">
                <h2>{selectedPresentation.title}</h2>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setSelectedPresentation(null)}
                >
                  Close
                </button>
              </div>

              <div className="presentation-summary">
                <p>
                  <strong>Presenter:</strong> {selectedPresentation.presenter}
                </p>
                <p>
                  <strong>Affiliation:</strong>{" "}
                  {selectedPresentation.affiliation}
                </p>
                <p>
                  <strong>Track:</strong> {selectedPresentation.track}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {formatDate(selectedPresentation.programDate)}
                </p>
                <p>
                  <strong>Time:</strong> {selectedPresentation.start} -{" "}
                  {selectedPresentation.end}
                </p>
                {selectedPresentation.isKeynote && (
                  <span className="badge">Keynote Presentation</span>
                )}
              </div>

              <div className="presentation-description">
                <h4>Abstract</h4>
                <p>{selectedPresentation.resume}</p>
              </div>

              <div className="presentation-rating-summary">
                <div>
                  <h4>Presentation Rating</h4>
                  {renderStars(selectedPresentation.presentationRating)}
                </div>
                <div>
                  <h4>Presenter Rating</h4>
                  {renderStars(selectedPresentation.presenterRating)}
                </div>
              </div>

              <div className="presentation-comments">
                <h4>Comments ({selectedPresentation.comments.length})</h4>
                {selectedPresentation.comments.map((comment) => (
                  <div key={comment.id} className="comment-card">
                    <div className="comment-meta">
                      <strong>{comment.userName}</strong>
                      <span>{new Date(comment.date).toLocaleDateString()}</span>
                    </div>
                    <p>{comment.comment}</p>
                    <div className="comment-ratings">
                      <span>Presentation: {comment.presentationRating}★</span>
                      <span>Presenter: {comment.presenterRating}★</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-details">
              <p>Select a presentation to see details and comments.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PresentationsPage;
