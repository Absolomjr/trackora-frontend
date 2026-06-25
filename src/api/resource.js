import api from "./axios";

/**
 * Factory that builds a standard CRUD client for a DRF resource.
 *
 *   const products = createResource("/products");
 *   products.list({ search: "cement", page: 2 })  -> GET /products/?search=cement&page=2
 *   products.get(id)                               -> GET /products/:id/
 *   products.create(payload)                       -> POST /products/
 *   products.update(id, payload)                   -> PATCH /products/:id/
 *   products.replace(id, payload)                  -> PUT /products/:id/
 *   products.remove(id)                            -> DELETE /products/:id/
 *
 * `basePath` should start with "/" and NOT include a trailing slash; DRF
 * expects trailing slashes which we add here.
 */
export default function createResource(basePath) {
  const collection = `${basePath}/`;
  const detail = (id) => `${basePath}/${id}/`;

  return {
    basePath,

    list: (params = {}, config = {}) =>
      api.get(collection, { params, ...config }).then((r) => r.data),

    get: (id, config = {}) => api.get(detail(id), config).then((r) => r.data),

    create: (payload, config = {}) =>
      api.post(collection, payload, config).then((r) => r.data),

    update: (id, payload, config = {}) =>
      api.patch(detail(id), payload, config).then((r) => r.data),

    replace: (id, payload, config = {}) =>
      api.put(detail(id), payload, config).then((r) => r.data),

    remove: (id, config = {}) =>
      api.delete(detail(id), config).then((r) => r.data),

    // Escape hatch for custom sub-actions, e.g. /orders/:id/cancel/
    action: (id, action, payload = {}, config = {}) =>
      api
        .post(`${basePath}/${id}/${action}/`, payload, config)
        .then((r) => r.data),
  };
}
