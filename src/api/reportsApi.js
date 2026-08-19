import api from "./axios";

const get = (path, params) =>
  api.get(`/reports/${path}/`, { params }).then((r) => r.data);

const reportsApi = {
  overview: () => get("overview"),
  dashboard: () => get("dashboard"),
  lowStock: () => get("low-stock"),
  dailySales: (days = 30) => get("daily-sales", { days }),
  monthlySales: (months = 12) => get("monthly-sales", { months }),
  profit: (days = 30) => get("profit", { days }),
  bestSelling: (limit = 10) => get("best-selling", { limit }),
};

export default reportsApi;
