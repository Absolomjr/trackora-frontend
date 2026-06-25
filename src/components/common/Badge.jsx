// Generic status badge. `tone` maps to a color; pass plain to hide the dot.
const TONES = {
  green: "badge--green",
  orange: "badge--orange",
  red: "badge--red",
  blue: "badge--blue",
  slate: "badge--slate",
};

export default function Badge({ tone = "slate", plain, children }) {
  return (
    <span className={`badge ${TONES[tone] || TONES.slate} ${plain ? "badge--plain" : ""}`}>
      {children}
    </span>
  );
}

// Derives a stock badge from quantity vs reorder level.
export function StockBadge({ quantity = 0, reorderLevel = 0 }) {
  if (quantity <= 0) return <Badge tone="red">Out of Stock</Badge>;
  if (quantity <= reorderLevel) return <Badge tone="orange">Low Stock</Badge>;
  return <Badge tone="green">In Stock</Badge>;
}

const ORDER_TONES = {
  completed: "green",
  pending: "blue",
  cancelled: "red",
};

export function OrderStatusBadge({ status }) {
  const tone = ORDER_TONES[status] || "slate";
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : "—";
  return <Badge tone={tone}>{label}</Badge>;
}

export function RoleBadge({ role }) {
  const label = role ? role.charAt(0).toUpperCase() + role.slice(1) : "—";
  return <span className={`badge badge--plain role-${role}`}>{label}</span>;
}
