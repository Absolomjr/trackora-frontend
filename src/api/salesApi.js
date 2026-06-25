import createResource from "./resource";

const orders = createResource("/orders");

const salesApi = {
  ...orders,

  // POST /orders/:id/cancel/ — restores stock (Manager/Admin only)
  cancel: (id) => orders.action(id, "cancel"),
};

export default salesApi;
