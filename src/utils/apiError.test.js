import { describe, it, expect } from "vitest";

import { parseApiError } from "./apiError";

describe("parseApiError", () => {
  it("handles a network error (no response)", () => {
    const { message, fields } = parseApiError({});
    expect(message).toMatch(/network/i);
    expect(fields).toEqual({});
  });

  it("maps 401/403/404 to friendly messages", () => {
    expect(parseApiError({ response: { status: 401 } }).message).toMatch(/session/i);
    expect(parseApiError({ response: { status: 403 } }).message).toMatch(/permission/i);
    expect(parseApiError({ response: { status: 404 } }).message).toMatch(/not found/i);
  });

  it("extracts per-field errors from a DRF validation body", () => {
    const err = {
      response: { status: 400, data: { email: ["This field is required."], phone: ["Invalid."] } },
    };
    const { fields } = parseApiError(err);
    expect(fields.email).toBe("This field is required.");
    expect(fields.phone).toBe("Invalid.");
  });

  it("surfaces detail / non_field_errors as the top message", () => {
    const err = { response: { status: 400, data: { detail: "Nope." } } };
    expect(parseApiError(err).message).toBe("Nope.");
  });

  it("passes through a plain string body", () => {
    const err = { response: { status: 400, data: "Server exploded" } };
    expect(parseApiError(err).message).toBe("Server exploded");
  });
});
