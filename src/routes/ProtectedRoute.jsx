import { Navigate, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import { LoadingBlock } from "../components/common/Spinner";

/**
 * Guards routes by authentication and (optionally) role.
 *
 *   <ProtectedRoute><Layout /></ProtectedRoute>
 *   <ProtectedRoute allow={[ROLES.ADMIN]}><Users /></ProtectedRoute>
 *
 * - Not logged in            -> redirect to /login (remembering the target).
 * - Logged in, wrong role     -> redirect to /dashboard.
 */
export default function ProtectedRoute({ allow, children }) {
  const { isAuthenticated, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingBlock label="Checking your session…" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allow && !hasRole(allow)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
