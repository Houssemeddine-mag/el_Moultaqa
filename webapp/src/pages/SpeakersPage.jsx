export default function SpeakersPage() {
  const speakers = [
    { name: "Jane Doe", title: "Keynote Speaker" },
    { name: "Ali Khan", title: "Event Strategist" },
    { name: "Sara Li", title: "Community Lead" },
  ];

  return (
    <div className="page-shell">
      <div className="card">
        <h1 className="section-title">Speakers</h1>
        <p>Meet the people shaping the conference experience.</p>
      </div>
      <div className="list-grid">
        {speakers.map((speaker) => (
          <article key={speaker.name} className="card">
            <h3>{speaker.name}</h3>
            <p>{speaker.title}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
