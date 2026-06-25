// Dashboard KPI card with a colored icon tile.
export default function StatCard({ label, value, hint, icon, tone = "blue" }) {
  return (
    <div className="stat-card">
      <div className={`stat-card__icon tile-${tone}`}>{icon}</div>
      <div>
        <div className="stat-card__label">{label}</div>
        <div className="stat-card__value">{value}</div>
        {hint && <div className="stat-card__hint">{hint}</div>}
      </div>
    </div>
  );
}
