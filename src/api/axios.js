import axios from "axios";

import { STORAGE } from "../utils/constants";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token helpers — single source of truth for reading/writing tokens.
export const tokenStore = {
  getAccess: () => localStorage.getItem(STORAGE.ACCESS),
  getRefresh: () => localStorage.getItem(STORAGE.REFRESH),
  set: ({ access, refresh }) => {
    if (access) localStorage.setItem(STORAGE.ACCESS, access);
    if (refresh) localStorage.setItem(STORAGE.REFRESH, refresh);
  },
  clear: () => {
    localStorage.removeItem(STORAGE.ACCESS);
    localStorage.removeItem(STORAGE.REFRESH);
    localStorage.removeItem(STORAGE.USER);
  },
};

// Allow the auth layer to register a callback that runs when refresh fails
// (so it can log the user out / redirect). Avoids a hard import cycle.
let onAuthFailure = null;
export function setAuthFailureHandler(handler) {
  onAuthFailure = handler;
}

// --- Request interceptor: attach the access token ---------------------------
api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Response interceptor: transparent token refresh on 401 -----------------
// We queue requests that arrive while a refresh is in-flight, then replay them.
let isRefreshing = false;
let pendingQueue = [];

function flushQueue(error, token = null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    // Only attempt refresh once per request, and never for the refresh call itself.
    const isRefreshCall = original?.url?.includes("/auth/refresh");
    if (status !== 401 || original?._retry || isRefreshCall) {
      return Promise.reject(error);
    }

    const refresh = tokenStore.getRefresh();
    if (!refresh) {
      tokenStore.clear();
      onAuthFailure?.();
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      // Wait for the ongoing refresh, then retry with the new token.
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }

    isRefreshing = true;
    try {
      const { data } = await axios.post(`${BASE_URL}/auth/refresh/`, {
        refresh,
      });
      const newAccess = data.access;
      // The backend rotates refresh tokens (ROTATE_REFRESH_TOKENS=True), so it
      // returns a fresh refresh token too. Persist it, otherwise the stored
      // refresh token's 7-day window never extends and active users get logged
      // out on a fixed schedule.
      tokenStore.set({ access: newAccess, refresh: data.refresh });
      flushQueue(null, newAccess);
      original.headers.Authorization = `Bearer ${newAccess}`;
      return api(original);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      tokenStore.clear();
      onAuthFailure?.();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
