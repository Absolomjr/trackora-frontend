import useAuth from "../../hooks/useAuth";

/**
 * Conditionally renders children only when the current user's role is in `allow`.
 * Useful for hiding action buttons (create/edit/delete) the user can't perform.
 *
 *   <RoleGate allow={MANAGER_ADMIN}>
 *     <Button>Add product</Button>
 *   </RoleGate>
 */
export default function RoleGate({ allow, children, fallback = null }) {
  const { hasRole } = useAuth();
  return hasRole(allow) ? children : fallback;
}
