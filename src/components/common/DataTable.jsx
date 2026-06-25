import { LoadingBlock } from "./Spinner";
import EmptyState from "./EmptyState";

/**
 * Lightweight table renderer.
 *
 *   <DataTable
 *     columns={[
 *       { key: "name", header: "Name", render: (row) => row.name },
 *       { key: "price", header: "Price", align: "right", render: (row) => fmt(row.price) },
 *     ]}
 *     rows={products}
 *     loading={loading}
 *     rowKey={(r) => r.id}
 *   />
 */
export default function DataTable({
  columns,
  rows,
  loading,
  rowKey = (row) => row.id,
  emptyTitle = "No records found",
  emptyMessage,
  emptyIcon,
  emptyAction,
  onRowClick,
}) {
  if (loading) return <LoadingBlock />;

  if (!rows || rows.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
        icon={emptyIcon}
        action={emptyAction}
      />
    );
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ textAlign: col.align || "left", width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              style={onRowClick ? { cursor: "pointer" } : undefined}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={col.align === "right" ? "num" : ""}
                  style={{ textAlign: col.align || "left" }}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
