/**
 * Normalises a DRF/axios error into a single human-readable message and an
 * optional per-field error map (for form display).
 *
 *   const { message, fields } = parseApiError(err);
 */
export function parseApiError(error) {
  const data = error?.response?.data;
  const status = error?.response?.status;

  if (!error?.response) {
    return {
      message: "Network error — could not reach the server.",
      fields: {},
    };
  }

  if (status === 401) {
    return { message: "Your session has expired. Please log in again.", fields: {} };
  }
  if (status === 403) {
    return { message: "You don't have permission to perform this action.", fields: {} };
  }
  if (status === 404) {
    return { message: "The requested resource was not found.", fields: {} };
  }

  if (typeof data === "string") {
    return { message: data, fields: {} };
  }

  if (data && typeof data === "object") {
    const fields = {};
    const messages = [];

    Object.entries(data).forEach(([key, value]) => {
      const text = Array.isArray(value) ? value.join(" ") : String(value);
      if (key === "detail" || key === "non_field_errors") {
        messages.push(text);
      } else {
        fields[key] = text;
        messages.push(`${prettyKey(key)}: ${text}`);
      }
    });

    return {
      message: messages[0] || "Something went wrong. Please try again.",
      fields,
    };
  }

  return { message: "Something went wrong. Please try again.", fields: {} };
}

function prettyKey(key) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default parseApiError;
