import { describe, expect, it } from "vitest";
import { formatJson, minifyJson, validateJson } from "./json";

describe("json converter", () => {
  it("formats objects", () => {
    const result = formatJson('{"a":1}');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output).toBe('{\n  "a": 1\n}');
  });

  it("minifies objects", () => {
    const result = minifyJson('{\n  "a": 1\n}');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output).toBe('{"a":1}');
  });

  it("rejects invalid json", () => {
    const result = validateJson("{");
    expect(result.ok).toBe(false);
  });
});
