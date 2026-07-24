/** A single shimmering placeholder block. */
export default function Skeleton({ width, height = 14, radius = 6, className = "" }) {
  return (
    <span
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: radius }}
    />
  );
}

/** Skeleton rows shaped like a DataTable, shown while a table loads. */
export function TableSkeleton({ columns, rows = 6 }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ textAlign: col.align || "left", width: col.width }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {columns.map((col) => (
                <td key={col.key} style={{ textAlign: col.align || "left" }}>
                  <Skeleton width={col.align === "right" ? "40%" : "70%"} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
