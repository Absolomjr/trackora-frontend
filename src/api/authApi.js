import api, { tokenStore } from "./axios";
import createResource from "./resource";

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

  // --- Admin user management ---
  users,
};

export default authApi;
