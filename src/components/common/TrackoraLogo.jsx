
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
