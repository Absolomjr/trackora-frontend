import { createContext, useCallback, useEffect, useMemo, useState } from "react";

import authApi from "../api/authApi";
import { setAuthFailureHandler, tokenStore } from "../api/axios";
import { STORAGE } from "../utils/constants";

export const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(true);

  const persistUser = useCallback((nextUser) => {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem(STORAGE.USER, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(STORAGE.USER);
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    persistUser(null);
  }, [persistUser]);

  const login = useCallback(
    async (email, password) => {
      const data = await authApi.login(email, password);
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
