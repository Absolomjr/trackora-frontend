import { describe, it, expect } from "vitest";

import { asResults, asCount } from "./pagination";

describe("asResults", () => {
  it("returns a bare array unchanged", () => {
    expect(asResults([1, 2, 3])).toEqual([1, 2, 3]);
  });
  it("unwraps a DRF paginated object", () => {
    expect(asResults({ count: 2, results: ["a", "b"] })).toEqual(["a", "b"]);
  });
  it("falls back to an empty array for junk", () => {
    expect(asResults(null)).toEqual([]);
    expect(asResults(undefined)).toEqual([]);
    expect(asResults({})).toEqual([]);
  });
});

describe("asCount", () => {
  it("uses array length for bare arrays", () => {
    expect(asCount([1, 2, 3])).toBe(3);
  });
  it("prefers the DRF count field", () => {
    expect(asCount({ count: 42, results: ["a"] })).toBe(42);
  });
  it("returns 0 for junk", () => {
    expect(asCount(null)).toBe(0);
  });
});
