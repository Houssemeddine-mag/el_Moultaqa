export default function RatingsPage() {
  const ratings = [
    { label: "App quality", value: 4.8 },
    { label: "Schedule accuracy", value: 4.6 },
    { label: "Speaker experience", value: 4.7 },
  ];

  return (
    <div className="page-shell">
      <div className="card">
        <h1 className="section-title">Ratings</h1>
        <p>Feedback metrics for the conference experience.</p>
      </div>
      <div className="list-grid">
        {ratings.map((item) => (
          <article key={item.label} className="card">
            <h3>{item.label}</h3>
            <p>{item.value} / 5</p>
          </article>
        ))}
      </div>
    </div>
  );
}
