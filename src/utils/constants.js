// Mirrors the backend enums and shared constants used across the app.

// User roles (from accounts app)
export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  STAFF: "staff",
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Admin",
  [ROLES.MANAGER]: "Manager",
  [ROLES.STAFF]: "Staff",
};

export const ROLE_OPTIONS = [
  { value: ROLES.ADMIN, label: "Admin" },
  { value: ROLES.MANAGER, label: "Manager" },
  { value: ROLES.STAFF, label: "Staff" },
];

// Convenience role groups used for route gating.
export const MANAGER_ADMIN = [ROLES.ADMIN, ROLES.MANAGER];
export const ALL_ROLES = [ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF];

// Product units (hardware store context)
export const UNIT_OPTIONS = [
  { value: "piece", label: "Piece" },
  { value: "bag", label: "Bag" },
  { value: "box", label: "Box" },
  { value: "kg", label: "Kilogram (kg)" },
  { value: "litre", label: "Litre" },
  { value: "metre", label: "Metre" },
  { value: "roll", label: "Roll" },
  { value: "bundle", label: "Bundle" },
  { value: "sheet", label: "Sheet" },
  { value: "packet", label: "Packet" },
];

// Payment methods for orders
export const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "mobile_money", label: "Mobile Money" },
  { value: "card", label: "Card" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "credit", label: "Credit" },
];

// Order statuses
export const ORDER_STATUS = {
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  PENDING: "pending",
};

// Currency used by the store
export const CURRENCY = "UGX";

// Default page size used by DRF pagination
export const PAGE_SIZE = 10;

// localStorage keys
export const STORAGE = {
  ACCESS: "access_token",
  REFRESH: "refresh_token",
  USER: "auth_user",
};
