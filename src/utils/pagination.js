/**
 * DRF list endpoints may return either a bare array or a paginated object
 * `{ count, next, previous, results }`. These helpers normalise both shapes.
 */
export function asResults(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

export function asCount(data) {
  if (Array.isArray(data)) return data.length;
  if (data && typeof data.count === "number") return data.count;
  return asResults(data).length;
}
