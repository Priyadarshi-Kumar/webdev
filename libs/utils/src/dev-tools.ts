export type ToolResult = { ok: true; output: string } | { ok: false; error: string };

function ok(output: string): ToolResult {
  return { ok: true, output };
}

function err(error: string): ToolResult {
  return { ok: false, error };
}

export function encodeBase64(text: string): ToolResult {
  try {
    return ok(btoa(unescape(encodeURIComponent(text))));
  } catch (error) {
    return err(error instanceof Error ? error.message : "Could not encode");
  }
}

export function decodeBase64(text: string): ToolResult {
  try {
    return ok(decodeURIComponent(escape(atob(text.trim()))));
  } catch (error) {
    return err(error instanceof Error ? error.message : "Invalid Base64");
  }
}

export function encodeUri(text: string): ToolResult {
  try {
    return ok(encodeURIComponent(text));
  } catch (error) {
    return err(error instanceof Error ? error.message : "Could not encode");
  }
}

export function decodeUri(text: string): ToolResult {
  try {
    return ok(decodeURIComponent(text.trim()));
  } catch (error) {
    return err(error instanceof Error ? error.message : "Invalid URI encoding");
  }
}

export function encodeHtmlEntities(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function decodeHtmlEntities(text: string): ToolResult {
  try {
    const doc = new DOMParser().parseFromString(text, "text/html");
    return ok(doc.documentElement.textContent ?? "");
  } catch (error) {
    return err(error instanceof Error ? error.message : "Could not decode");
  }
}

export function decodeJwt(token: string): ToolResult {
  const parts = token.trim().split(".");
  if (parts.length < 2) return err("JWT must have at least header and payload.");

  try {
    const decodePart = (part: string) => {
      const padded = part.replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(
        escape(atob(padded.padEnd(padded.length + ((4 - (padded.length % 4)) % 4), "="))),
      );
      return JSON.parse(json);
    };

    const output = {
      header: decodePart(parts[0]!),
      payload: decodePart(parts[1]!),
      signature: parts[2] ?? "(none)",
    };
    return ok(JSON.stringify(output, null, 2));
  } catch (error) {
    return err(error instanceof Error ? error.message : "Invalid JWT");
  }
}

export function generateUuid(): string {
  return crypto.randomUUID();
}

export async function hashText(text: string, algorithm: "SHA-256" | "SHA-1" = "SHA-256"): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest(algorithm, data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function unixToDate(input: string): ToolResult {
  const trimmed = input.trim();
  if (!trimmed) return err("Enter a Unix timestamp.");
  const ms = trimmed.length <= 10 ? Number(trimmed) * 1000 : Number(trimmed);
  if (!Number.isFinite(ms)) return err("Not a valid number.");
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return err("Invalid timestamp.");
  return ok(`${date.toISOString()}\nLocal: ${date.toString()}`);
}

export function dateToUnix(input: string): ToolResult {
  const trimmed = input.trim();
  if (!trimmed) return err("Enter a date string.");
  const ms = Date.parse(trimmed);
  if (Number.isNaN(ms)) return err("Could not parse date.");
  return ok(`Seconds: ${Math.floor(ms / 1000)}\nMilliseconds: ${ms}`);
}

export function toCamelCase(text: string): string {
  return text
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c: string) => c.toUpperCase())
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}

export function toPascalCase(text: string): string {
  const camel = toCamelCase(text);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

export function toSnakeCase(text: string): string {
  return text
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

export function toKebabCase(text: string): string {
  return toSnakeCase(text).replace(/_/g, "-");
}

export function toConstantCase(text: string): string {
  return toSnakeCase(text).toUpperCase();
}

export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes)) return "Invalid";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = Math.abs(bytes);
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const sign = bytes < 0 ? "-" : "";
  return `${sign}${value.toFixed(value < 10 && unit > 0 ? 2 : 0)} ${units[unit]}`;
}

export function parseByteInput(input: string): ToolResult {
  const match = input.trim().match(/^(-?\d+(?:\.\d+)?)\s*(b|kb|mb|gb|tb)?$/i);
  if (!match) return err("Use a number with optional unit: B, KB, MB, GB, TB.");
  const amount = Number(match[1]);
  const unit = (match[2] ?? "b").toLowerCase();
  const multipliers: Record<string, number> = { b: 1, kb: 1024, mb: 1024 ** 2, gb: 1024 ** 3, tb: 1024 ** 4 };
  const bytes = amount * (multipliers[unit] ?? 1);
  return ok(`${bytes} bytes\n${formatBytes(bytes)}`);
}

export function compareSemver(a: string, b: string): ToolResult {
  const pa = (a.trim().replace(/^v/i, "").split("-")[0] ?? "").split(".").map(Number);
  const pb = (b.trim().replace(/^v/i, "").split("-")[0] ?? "").split(".").map(Number);
  if (pa.some(Number.isNaN) || pb.some(Number.isNaN)) return err("Enter valid semver strings like 1.2.3");
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) {
      return ok(diff > 0 ? `${a} is greater than ${b}` : `${a} is less than ${b}`);
    }
  }
  return ok(`${a} equals ${b}`);
}

export function csvToJson(csv: string): ToolResult {
  const lines = csv.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return err("CSV is empty.");
  const headers = lines[0]!.split(",").map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
  return ok(JSON.stringify(rows, null, 2));
}

export function jsonToCsv(json: string): ToolResult {
  try {
    const value = JSON.parse(json);
    if (!Array.isArray(value) || value.length === 0 || typeof value[0] !== "object") {
      return err("JSON must be a non-empty array of objects.");
    }
    const headers = [...new Set(value.flatMap((row) => Object.keys(row as object)))];
    const lines = [
      headers.join(","),
      ...value.map((row) =>
        headers.map((header) => String((row as Record<string, unknown>)[header] ?? "")).join(","),
      ),
    ];
    return ok(lines.join("\n"));
  } catch (error) {
    return err(error instanceof Error ? error.message : "Invalid JSON");
  }
}

export function lineDiff(left: string, right: string): string {
  const a = left.split(/\r?\n/);
  const b = right.split(/\r?\n/);
  const max = Math.max(a.length, b.length);
  const lines: string[] = [];
  for (let i = 0; i < max; i += 1) {
    const l = a[i];
    const r = b[i];
    if (l === r) lines.push(`  ${l ?? ""}`);
    else {
      if (l !== undefined) lines.push(`- ${l}`);
      if (r !== undefined) lines.push(`+ ${r}`);
    }
  }
  return lines.join("\n");
}

export function hexToRgb(hex: string): ToolResult {
  const cleaned = hex.trim().replace(/^#/, "");
  if (!/^[0-9a-f]{3}|[0-9a-f]{6}$/i.test(cleaned)) return err("Enter a 3 or 6 digit hex color.");
  const full =
    cleaned.length === 3 ? cleaned.split("").map((c) => c + c).join("") : cleaned;
  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);
  return ok(`rgb(${r}, ${g}, ${b})`);
}

export function rgbToHex(input: string): ToolResult {
  const match = input.trim().match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!match) return err("Enter rgb(r, g, b).");
  const parts = [match[1], match[2], match[3]].map((n) => Number(n));
  if (parts.some((n) => n < 0 || n > 255)) return err("RGB values must be 0–255.");
  const hex = parts.map((n) => n.toString(16).padStart(2, "0")).join("");
  return ok(`#${hex}`);
}

export function generatePassword(length = 16, symbols = true): string {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const symbolChars = "!@#$%^&*()-_=+[]{}";
  const pool = lower + upper + digits + (symbols ? symbolChars : "");
  const values = crypto.getRandomValues(new Uint32Array(length));
  return [...values].map((n) => pool[n % pool.length]).join("");
}

export function testRegex(pattern: string, flags: string, sample: string): ToolResult {
  try {
    const regex = new RegExp(pattern, flags);
    const matches = [...sample.matchAll(new RegExp(pattern, flags.includes("g") ? flags : `${flags}g`))];
    if (matches.length === 0) {
      return ok(regex.test(sample) ? "Match found (non-global test)." : "No matches.");
    }
    const lines = matches.map((match, index) => {
      const groups = match.slice(1).filter(Boolean);
      return `Match ${index + 1}: "${match[0]}"${groups.length ? ` groups: ${groups.join(", ")}` : ""}`;
    });
    return ok(lines.join("\n"));
  } catch (error) {
    return err(error instanceof Error ? error.message : "Invalid regular expression");
  }
}
