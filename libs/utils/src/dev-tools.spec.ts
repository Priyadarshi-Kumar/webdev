import { describe, expect, it } from "vitest";
import {
  compareSemver,
  convertNumberBase,
  csvToJson,
  decodeBase64,
  describeCron,
  encodeBase64,
  encodeHtmlEntities,
  formatBytes,
  generatePassword,
  hexToRgb,
  inspectUrl,
  jsonToCsv,
  lineDiff,
  lookupHttpStatus,
  parseByteInput,
  parseChmod,
  rgbToHex,
  slugify,
  toSnakeCase,
  transformLines,
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

  it("converts number bases", () => {
    const result = convertNumberBase("ff", 16);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output).toContain("Decimal: 255");
      expect(result.output).toContain("0b11111111");
    }
  });

  it("inspects urls", () => {
    const result = inspectUrl("https://example.com:8443/path?q=1#top");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output).toContain("Hostname: example.com");
      expect(result.output).toContain("q=1");
    }
  });

  it("transforms lines", () => {
    expect(transformLines("b\na\nb", "sort")).toEqual({ ok: true, output: "a\nb\nb" });
    expect(transformLines("b\na\nb", "unique")).toEqual({ ok: true, output: "b\na" });
    const stats = transformLines("hello world", "stats");
    expect(stats.ok).toBe(true);
    if (stats.ok) expect(stats.output).toContain("Words: 2");
  });

  it("parses chmod", () => {
    const octal = parseChmod("755");
    expect(octal.ok).toBe(true);
    if (octal.ok) expect(octal.output).toContain("rwxr-xr-x");
    const symbolic = parseChmod("rw-r--r--");
    expect(symbolic.ok).toBe(true);
    if (symbolic.ok) expect(symbolic.output).toContain("Octal: 644");
  });

  it("describes cron", () => {
    const result = describeCron("*/15 9-17 * * 1-5");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output).toContain("Minute: every 15");
      expect(result.output).toContain("Hour: 9–17");
    }
  });

  it("looks up http status", () => {
    expect(lookupHttpStatus("404")[0]).toMatchObject({ code: 404, name: "Not Found" });
    expect(lookupHttpStatus("unauth").some((item) => item.code === 401)).toBe(true);
  });
});
