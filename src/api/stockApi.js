import createResource from "./resource";

// Stock-in and stock-out are separate DRF endpoints. Each record carries
// line items that atomically adjust product quantities on the backend.
export const stockIn = createResource("/stock-in");
export const stockOut = createResource("/stock-out");

const stockApi = { stockIn, stockOut };

export default stockApi;
