import { describe, expect, it } from "vitest";
import {
  compareSemver,
  csvToJson,
  decodeBase64,
  encodeBase64,
  encodeHtmlEntities,
  formatBytes,
  generatePassword,
  hexToRgb,
  jsonToCsv,
  lineDiff,
  parseByteInput,
  rgbToHex,
  slugify,
  toSnakeCase,
  unixToDate,
} from "./dev-tools";

describe("dev-tools", () => {
  it("round-trips base64", () => {
    const encoded = encodeBase64("hello 🌍");
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) return;
    const decoded = decodeBase64(encoded.output);
    expect(decoded).toEqual({ ok: true, output: "hello 🌍" });
  });

  it("encodes html entities", () => {
    expect(encodeHtmlEntities(`<a href="x">`)).toBe("&lt;a href=&quot;x&quot;&gt;");
  });

  it("converts unix timestamp", () => {
    const result = unixToDate("0");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output).toContain("1970");
  });

  it("slugifies text", () => {
    expect(slugify("Hello World — Post!")).toBe("hello-world-post");
  });

  it("converts case", () => {
    expect(toSnakeCase("helloWorld")).toBe("hello_world");
  });

  it("compares semver", () => {
    const result = compareSemver("1.2.10", "1.2.3");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output).toContain("greater");
  });

  it("converts csv and json", () => {
    const json = csvToJson("a,b\n1,2");
    expect(json.ok).toBe(true);
    if (!json.ok) return;
    const csv = jsonToCsv(json.output);
    expect(csv.ok).toBe(true);
  });

  it("diffs lines", () => {
    const diff = lineDiff("a\nb", "a\nc");
    expect(diff).toContain("- b");
    expect(diff).toContain("+ c");
  });

  it("converts colors", () => {
    const hex = hexToRgb("#fff");
    expect(hex.ok).toBe(true);
    if (hex.ok) expect(hex.output).toBe("rgb(255, 255, 255)");
    const rgb = rgbToHex("rgb(0, 128, 255)");
    expect(rgb.ok).toBe(true);
    if (rgb.ok) expect(rgb.output).toBe("#0080ff");
  });

  it("formats bytes", () => {
    expect(formatBytes(1024)).toBe("1.00 KB");
    expect(parseByteInput("1 KB").ok).toBe(true);
  });

  it("generates passwords", () => {
    const password = generatePassword(20, true);
    expect(password).toHaveLength(20);
  });
});
