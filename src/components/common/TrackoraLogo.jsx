/**
 * Trackora "T" mark — a 3D-extruded green block letter, matching the brand
 * mockups. `size` sets the pixel box; colours are fixed to the brand greens.
 */
export default function TrackoraLogo({ size = 32, className = "" }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Trackora"
    >
      {/* extruded depth */}
      <path
        d="M11 11 H43 V22 H31.5 V43 H21.5 V22 H11 Z"
        fill="#14532d"
      />
      {/* front face */}
      <path
        d="M8 8 H40 V19 H28.5 V40 H18.5 V19 H8 Z"
        fill="#16a34a"
      />
      {/* top highlight on the crossbar */}
      <path d="M8 8 H40 V13 H8 Z" fill="#4ade80" />
      {/* stem highlight */}
      <path d="M18.5 19 H28.5 V24 H18.5 Z" fill="#22c55e" />
    </svg>
  );
}

/** Logo + wordmark lockup used in nav / auth headers. */
export function TrackoraWordmark({ size = 30, className = "" }) {
  return (
    <span className={`trackora-wordmark ${className}`}>
      <TrackoraLogo size={size} />
      <span className="trackora-wordmark__text">Trackora</span>
    </span>
  );
}
