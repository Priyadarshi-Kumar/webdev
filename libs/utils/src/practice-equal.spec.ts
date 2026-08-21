import { describe, expect, it } from "vitest";
import { deepEqual, formatValue } from "./practice-equal";

describe("deepEqual", () => {
  it("matches primitives and NaN", () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual(NaN, NaN)).toBe(true);
    expect(deepEqual(0, -0)).toBe(false);
    expect(deepEqual("a", "a")).toBe(true);
    expect(deepEqual(null, null)).toBe(true);
    expect(deepEqual(null, undefined)).toBe(false);
  });

  it("matches arrays and objects regardless of key order", () => {
    expect(deepEqual([1, { a: 2 }], [1, { a: 2 }])).toBe(true);
    expect(deepEqual({ b: 1, a: 2 }, { a: 2, b: 1 })).toBe(true);
    expect(deepEqual([1, 2], [1, 3])).toBe(false);
    expect(deepEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });
});

describe("formatValue", () => {
  it("prints values a learner can read", () => {
    expect(formatValue(undefined)).toBe("undefined");
    expect(formatValue("hi")).toBe('"hi"');
    expect(formatValue({ a: 1 })).toBe('{"a":1}');
  });
});
