export default function RatingsPage() {
  return (
    <div className="page-shell">
      <div className="card">
        <h1 className="section-title">Ratings</h1>
        <p>Feedback metrics for the conference experience.</p>
      </div>
      <div className="card" style={{ textAlign: "center", padding: "3rem 2rem" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📊</div>
        <h3 style={{ marginBottom: "0.5rem" }}>Ratings Coming Soon</h3>
        <p style={{ color: "var(--text-muted, #888)", maxWidth: 360, margin: "0 auto" }}>
          Session and presenter ratings will appear here once attendees begin submitting feedback.
        </p>
      </div>
    </div>
  );
}

