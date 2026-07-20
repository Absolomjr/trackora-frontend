import axios from "axios";

import api from "./axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// The landing page is public, so lead submissions use a bare axios instance
// rather than the shared `api` client. A stale token in localStorage would
// otherwise trigger the 401-refresh interceptor on a page where nobody is
// logged in.
const publicClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const LEAD_KIND = {
  SIGNUP: "signup",
  DEMO: "demo",
};

const leadsApi = {
  /**
   * POST /api/leads/ — public. `source` should name the landing-page section
   * the form was submitted from (e.g. "hero", "final-cta") so we can see which
   * part of the page converts.
   */
  create: (payload) =>
    publicClient.post("/leads/", payload).then((res) => res.data),

  requestAccount: (payload) =>
    leadsApi.create({ ...payload, kind: LEAD_KIND.SIGNUP }),

  requestDemo: (payload) =>
    leadsApi.create({ ...payload, kind: LEAD_KIND.DEMO }),

  // --- Admin-only review endpoints (authenticated) --------------------------
  list: (params) =>
    api.get("/leads/all/", { params }).then((res) => res.data),

  get: (id) => api.get(`/leads/all/${id}/`).then((res) => res.data),

  /** Only `status` and `note` are writable server-side. */
  update: (id, payload) =>
    api.patch(`/leads/all/${id}/`, payload).then((res) => res.data),

  remove: (id) => api.delete(`/leads/all/${id}/`).then((res) => res.data),
};

export default leadsApi;
