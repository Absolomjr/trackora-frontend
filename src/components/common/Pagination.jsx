import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { PAGE_SIZE } from "../../utils/constants";

/**
 * Pagination control driven by DRF's `count` and the current page.
 * `count` is the total number of records; `pageSize` defaults to the API page size.
 */
export default function Pagination({
  page,
  count = 0,
  pageSize = PAGE_SIZE,
  onChange,
}) {
  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  if (totalPages <= 1) {
    return (
      <div className="pagination">
        <span className="pagination__info">
          {count} {count === 1 ? "record" : "records"}
        </span>
      </div>
    );
  }

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, count);

  // Build a compact page window.
  const pages = [];
  const windowSize = 1;
  for (let p = 1; p <= totalPages; p += 1) {
    if (
      p === 1 ||
      p === totalPages ||
      (p >= page - windowSize && p <= page + windowSize)
    ) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  return (
    <div className="pagination">
      <span className="pagination__info">
        Showing {start}–{end} of {count}
      </span>
      <div className="pagination__controls">
        <button
          className="pagination__btn"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          aria-label="Previous page"
        >
          <FiChevronLeft />
        </button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`gap-${i}`} className="pagination__btn" style={{ border: "none", background: "none", cursor: "default" }}>
              …
            </span>
          ) : (
            <button
              key={p}
              className={`pagination__btn ${p === page ? "active" : ""}`}
              onClick={() => onChange(p)}
            >
              {p}
            </button>
          )
        )}
        <button
          className="pagination__btn"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          aria-label="Next page"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}
