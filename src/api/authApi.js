import axios from "axios";

import api, { tokenStore } from "./axios";
import createResource from "./resource";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// Password-reset endpoints are public. Use a bare client so a stale token in
// localStorage can't attach and trigger a 401 on an unauthenticated call.
const publicClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Admin user management resource (/api/auth/users/)
const users = createResource("/auth/users");

const authApi = {
  // --- Session ---
  login: async (email, password) => {
    const { data } = await api.post("/auth/login/", { email, password });
    tokenStore.set({ access: data.access, refresh: data.refresh });
    return data; // { access, refresh, user }
  },

  logout: () => {
    tokenStore.clear();
  },

  // --- Profile ---
  getProfile: () => api.get("/auth/profile/").then((r) => r.data),
  updateProfile: (payload) =>
    api.patch("/auth/profile/", payload).then((r) => r.data),

  changePassword: (payload) =>
    api.post("/auth/change-password/", payload).then((r) => r.data),

  register: (payload) =>
    api.post("/auth/register/", payload).then((r) => r.data),

  // --- Password reset (public) ---
  requestPasswordReset: (email) =>
    publicClient.post("/auth/password-reset/", { email }).then((r) => r.data),

  confirmPasswordReset: (payload) =>
    publicClient.post("/auth/password-reset/confirm/", payload).then((r) => r.data),

  // --- Admin user management ---
  users,
};

export default authApi;
