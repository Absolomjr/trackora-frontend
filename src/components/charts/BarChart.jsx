import EmptyState from "../common/EmptyState";

/**
 * Minimal dependency-free bar chart.
 * `data` is an array of { label, value }. `color` is one of: blue|accent|green.
 */
export default function BarChart({ data = [], color = "blue", formatValue }) {
  if (!data.length) {
    return <EmptyState title="No data for this period" />;
  }

  const max = Math.max(...data.map((d) => Number(d.value) || 0), 1);
  const colorClass = color === "accent" ? "accent" : color === "green" ? "green" : "";

  return (
    <div className="bar-chart">
      {data.map((d, i) => {
        const value = Number(d.value) || 0;
        const heightPct = Math.round((value / max) * 100);
        return (
          <div className="bar-chart__col" key={`${d.label}-${i}`}>
            <div className="bar-chart__bar-track">
              <div
                className={`bar-chart__bar ${colorClass}`}
                style={{ height: `${heightPct}%` }}
                title={`${d.label}: ${formatValue ? formatValue(value) : value}`}
              />
            </div>
            <span className="bar-chart__label">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}
