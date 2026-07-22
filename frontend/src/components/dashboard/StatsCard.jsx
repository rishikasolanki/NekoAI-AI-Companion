import "./StatsCard.css";

export default function StatsCard({
  title,
  value = 0,
  icon = "📊",
}) {
  return (
    <div
      className="stats-card"
      role="article"
      aria-label={title}
    >
      <div className="icon">
        {icon}
      </div>

      <div className="stats-content">
        <h3>{title}</h3>

        <h2>{value}</h2>
      </div>
    </div>
  );
}