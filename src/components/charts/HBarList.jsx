import EmptyState from "../common/EmptyState";

/**
 * Horizontal progress bars — good for "best selling" / ranked lists.
 * `data` is an array of { label, value, sub }.
 */
export default function HBarList({ data = [], formatValue }) {
  if (!data.length) return <EmptyState title="No data yet" />;

  const max = Math.max(...data.map((d) => Number(d.value) || 0), 1);

  return (
    <div className="hbar">
      {data.map((d, i) => {
        const value = Number(d.value) || 0;
        const pct = Math.round((value / max) * 100);
        return (
          <div className="hbar__row" key={`${d.label}-${i}`}>
            <div className="hbar__top">
              <span className="strong">{d.label}</span>
              <span className="muted">
                {formatValue ? formatValue(value) : value}
                {d.sub ? ` · ${d.sub}` : ""}
              </span>
            </div>
            <div className="hbar__track">
              <div className="hbar__fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
