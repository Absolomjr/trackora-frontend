import { useCallback, useEffect, useState } from "react";

/**
 * Minimal data-fetching hook. `fetcher` is an async function; it re-runs
 * whenever any value in `deps` changes, or when `refetch()` is called.
 * Returns { data, error, loading, refetch, setData }.
 *
 *   const { data, loading, refetch } = useFetch(
 *     () => productsApi.list({ search }),
 *     [search]
 *   );
 */
export default function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetcher()
      .then((result) => active && setData(result))
      .catch((err) => active && setError(err))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  return { data, error, loading, refetch, setData };
}
