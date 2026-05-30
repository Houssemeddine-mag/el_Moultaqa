export default function SpeakerCard({ speaker }) {
  return (
    <article className="speaker-card">
      <div className="speaker-avatar">{speaker.name[0]}</div>
      <div>
        <h3>{speaker.name}</h3>
        <p>{speaker.title}</p>
        <span>{speaker.topic}</span>
      </div>
    </article>
  );
}
