export default function StatCard({ stat }) {
  return (
    <article className="stat-card">
      <strong>{stat.value}</strong>
      <span>{stat.label}</span>
      <p>{stat.detail}</p>
    </article>
  );
}
