import { useEffect, useRef, useState } from "react";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Reveal-on-scroll. Adds `is-visible` once the element enters the viewport,
 * then stops observing. Respects prefers-reduced-motion by revealing
 * immediately (no animation, no observer).
 */
export default function useReveal(options = {}) {
  const ref = useRef(null);
  // Lazily start "visible" when motion is reduced or IO is unavailable, so we
  // never call setState synchronously inside the effect.
  const [visible, setVisible] = useState(
    () => prefersReducedMotion() || typeof IntersectionObserver === "undefined"
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px", ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, visible];
}
