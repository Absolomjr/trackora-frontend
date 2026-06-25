import api from "./axios";
import createResource from "./resource";

const base = createResource("/products");

// Products support image upload, so create/update need multipart when a File
// is present. We build FormData transparently in that case.
function buildPayload(payload) {
  const hasFile =
    payload && payload.image instanceof File;

  if (!hasFile) {
    // Strip a null/empty image so we don't clobber an existing one.
    // eslint-disable-next-line no-unused-vars
    const { image, ...rest } = payload || {};
    return { data: rest, config: {} };
  }

  const form = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;
    form.append(key, value);
  });
  return {
    data: form,
    config: { headers: { "Content-Type": "multipart/form-data" } },
  };
}

const productsApi = {
  ...base,

  create: (payload) => {
    const { data, config } = buildPayload(payload);
    return api.post("/products/", data, config).then((r) => r.data);
  },

  update: (id, payload) => {
    const { data, config } = buildPayload(payload);
    return api.patch(`/products/${id}/`, data, config).then((r) => r.data);
  },
};

export default productsApi;
