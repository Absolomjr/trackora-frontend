import { createContext, useCallback, useEffect, useMemo, useState } from "react";

import authApi from "../api/authApi";
import { setAuthFailureHandler, tokenStore } from "../api/axios";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => tokenStore.getUser());
  const [loading, setLoading] = useState(true);

  const persistUser = useCallback((nextUser) => {
    setUser(nextUser);
    tokenStore.setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    persistUser(null);
  }, [persistUser]);

  const login = useCallback(
    async (email, password, remember = true) => {
      const data = await authApi.login(email, password, remember);
      persistUser(data.user);
      return data.user;
    },
    [persistUser]
  );

  // Register a global handler so a failed token refresh logs the user out.
  useEffect(() => {
    setAuthFailureHandler(() => {
      persistUser(null);
    });
    return () => setAuthFailureHandler(null);
  }, [persistUser]);

  // On boot, if we have a token but want fresh user data, re-fetch the profile.
  useEffect(() => {
    let active = true;
    async function bootstrap() {
      if (!tokenStore.getAccess()) {
        setLoading(false);
        return;
      }
      try {
        const profile = await authApi.getProfile();
        if (active) persistUser(profile);
      } catch {
        // Interceptor handles refresh/clear; just stop loading.
      } finally {
        if (active) setLoading(false);
      }
    }
    bootstrap();
    return () => {
      active = false;
    };
  }, [persistUser]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      role: user?.role || null,
      login,
      logout,
      setUser: persistUser,
      hasRole: (roles) =>
        !roles || roles.length === 0 || roles.includes(user?.role),
    }),
    [user, loading, login, logout, persistUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
