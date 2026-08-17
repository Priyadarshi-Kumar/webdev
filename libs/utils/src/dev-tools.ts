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

export type NumberBase = 2 | 8 | 10 | 16;

export function convertNumberBase(input: string, from: NumberBase): ToolResult {
  let value = input.trim().replace(/[\s_]/g, "");
  if (!value) return err("Enter a number.");
  const negative = value.startsWith("-");
  if (negative) value = value.slice(1);
  if (from === 2 && /^0b/i.test(value)) value = value.slice(2);
  if (from === 8 && /^0o/i.test(value)) value = value.slice(2);
  if (from === 16 && /^0x/i.test(value)) value = value.slice(2);
  const digits = from === 2 ? /^[01]+$/ : from === 8 ? /^[0-7]+$/ : from === 16 ? /^[0-9a-f]+$/i : /^\d+$/;
  if (!digits.test(value)) return err(`Digits must be valid for base ${from}.`);
  try {
    const prefix = from === 2 ? "0b" : from === 8 ? "0o" : from === 16 ? "0x" : "";
    const n = from === 10 ? BigInt(value) : BigInt(`${prefix}${value}`);
    const signed = negative ? -n : n;
    return ok(
      [
        `Decimal: ${signed.toString(10)}`,
        `Hex: 0x${signed.toString(16)}`,
        `Octal: 0o${signed.toString(8)}`,
        `Binary: 0b${signed.toString(2)}`,
      ].join("\n"),
    );
  } catch {
    return err("Could not parse that number.");
  }
}

export function inspectUrl(input: string): ToolResult {
  const trimmed = input.trim();
  if (!trimmed) return err("Enter a URL.");
  try {
    const url = new URL(trimmed);
    const params = [...url.searchParams.entries()];
    const query = params.length ? params.map(([key, value]) => `${key}=${value}`).join("\n") : "(none)";
    return ok(
      [
        `Protocol: ${url.protocol.replace(/:$/, "")}`,
        `Username: ${url.username || "(none)"}`,
        `Host: ${url.host}`,
        `Hostname: ${url.hostname}`,
        `Port: ${url.port || "(default)"}`,
        `Path: ${url.pathname}`,
        `Hash: ${url.hash || "(none)"}`,
        `Origin: ${url.origin}`,
        "",
        "Query params:",
        query,
      ].join("\n"),
    );
  } catch {
    return err("Enter a valid absolute URL, including https://.");
  }
}

export type LineMode = "sort" | "unique" | "reverse" | "trim" | "stats";

export function transformLines(text: string, mode: LineMode): ToolResult {
  const raw = text.split(/\r?\n/);
  if (mode === "stats") {
    const nonEmpty = raw.filter((line) => line.trim().length > 0);
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return ok(
      [`Lines: ${raw.length}`, `Non-empty: ${nonEmpty.length}`, `Words: ${words}`, `Characters: ${text.length}`].join(
        "\n",
      ),
    );
  }
  let lines = [...raw];
  if (mode === "trim") lines = lines.map((line) => line.trim()).filter((line) => line.length > 0);
  if (mode === "sort") lines = [...lines].sort((a, b) => a.localeCompare(b));
  if (mode === "unique") {
    const seen = new Set<string>();
    lines = lines.filter((line) => {
      if (seen.has(line)) return false;
      seen.add(line);
      return true;
    });
  }
  if (mode === "reverse") lines = [...lines].reverse();
  return ok(lines.join("\n"));
}

const PERM_LETTERS = ["r", "w", "x"] as const;

function octalDigitToRwx(digit: number): string {
  return PERM_LETTERS.map((letter, index) => (digit & (1 << (2 - index)) ? letter : "-")).join("");
}

function rwxToOctalDigit(rwx: string): number | null {
  if (!/^[r-][w-][x-]$/.test(rwx)) return null;
  return (rwx[0] === "r" ? 4 : 0) + (rwx[1] === "w" ? 2 : 0) + (rwx[2] === "x" ? 1 : 0);
}

export function parseChmod(input: string): ToolResult {
  const trimmed = input.trim().replace(/^0/, "");
  if (!trimmed) return err("Enter octal like 755 or symbolic like rwxr-xr-x.");

  if (/^[0-7]{3}$/.test(trimmed) || /^[0-7]{4}$/.test(input.trim())) {
    const octal = input.trim().replace(/^0(?=[0-7]{3}$)/, "").slice(-3);
    const digits = octal.split("").map(Number);
    const symbolic = digits.map(octalDigitToRwx).join("");
    return ok(
      [
        `Octal: ${octal}`,
        `Symbolic: ${symbolic}`,
        `Owner: ${octalDigitToRwx(digits[0]!)}`,
        `Group: ${octalDigitToRwx(digits[1]!)}`,
        `Others: ${octalDigitToRwx(digits[2]!)}`,
      ].join("\n"),
    );
  }

  const symbolic = trimmed.replace(/\s+/g, "");
  if (/^[rwx-]{9}$/.test(symbolic)) {
    const parts = [symbolic.slice(0, 3), symbolic.slice(3, 6), symbolic.slice(6, 9)];
    const digits = parts.map(rwxToOctalDigit);
    if (digits.some((d) => d === null)) return err("Symbolic mode must use r, w, x, or -.");
    const octal = digits.join("");
    return ok(`Octal: ${octal}\nSymbolic: ${symbolic}`);
  }

  return err("Use 3-digit octal (755) or 9-character symbolic (rwxr-xr-x).");
}

const MONTH_NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const WEEKDAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function cronTokenToNumber(token: string, names: string[]): number | null {
  const upper = token.toUpperCase();
  const named = names.indexOf(upper);
  if (named >= 0) return named + (names === MONTH_NAMES ? 1 : 0);
  const n = Number(token);
  return Number.isInteger(n) ? n : null;
}

function describeCronField(value: string, label: string, min: number, max: number, names: string[] = []): string {
  if (value === "*") return `${label}: every value (${min}–${max})`;
  const describePart = (part: string): string => {
    const [range, step] = part.split("/");
    const stepN = step ? Number(step) : undefined;
    if (range === "*") return stepN ? `every ${stepN}` : "every";
    if (range?.includes("-")) {
      const [startRaw, endRaw] = range.split("-");
      const start = cronTokenToNumber(startRaw ?? "", names);
      const end = cronTokenToNumber(endRaw ?? "", names);
      if (start === null || end === null) return part;
      return stepN ? `${start}–${end} every ${stepN}` : `${start}–${end}`;
    }
    const n = cronTokenToNumber(range ?? "", names);
    return n === null ? part : String(n);
  };
  const parts = value.split(",").map(describePart);
  return `${label}: ${parts.join(", ")}`;
}

export function describeCron(expr: string): ToolResult {
  const parts = expr.trim().split(/\s+/).filter(Boolean);
  if (parts.length !== 5 && parts.length !== 6) {
    return err("Use 5 fields (minute hour day month weekday) or 6 with seconds first.");
  }
  const hasSeconds = parts.length === 6;
  const [seconds, minute, hour, day, month, weekday] = hasSeconds
    ? parts
    : [undefined, parts[0], parts[1], parts[2], parts[3], parts[4]];
  const lines = [
    hasSeconds && seconds ? describeCronField(seconds, "Seconds", 0, 59) : null,
    describeCronField(minute!, "Minute", 0, 59),
    describeCronField(hour!, "Hour", 0, 23),
    describeCronField(day!, "Day of month", 1, 31),
    describeCronField(month!, "Month", 1, 12, MONTH_NAMES),
    describeCronField(weekday!, "Day of week", 0, 6, WEEKDAY_NAMES),
  ].filter(Boolean) as string[];
  return ok(lines.join("\n"));
}

export const HTTP_STATUS: { code: number; name: string; group: string }[] = [
  { code: 100, name: "Continue", group: "Informational" },
  { code: 101, name: "Switching Protocols", group: "Informational" },
  { code: 200, name: "OK", group: "Success" },
  { code: 201, name: "Created", group: "Success" },
  { code: 202, name: "Accepted", group: "Success" },
  { code: 204, name: "No Content", group: "Success" },
  { code: 206, name: "Partial Content", group: "Success" },
  { code: 301, name: "Moved Permanently", group: "Redirection" },
  { code: 302, name: "Found", group: "Redirection" },
  { code: 304, name: "Not Modified", group: "Redirection" },
  { code: 307, name: "Temporary Redirect", group: "Redirection" },
  { code: 308, name: "Permanent Redirect", group: "Redirection" },
  { code: 400, name: "Bad Request", group: "Client error" },
  { code: 401, name: "Unauthorized", group: "Client error" },
  { code: 403, name: "Forbidden", group: "Client error" },
  { code: 404, name: "Not Found", group: "Client error" },
  { code: 405, name: "Method Not Allowed", group: "Client error" },
  { code: 409, name: "Conflict", group: "Client error" },
  { code: 410, name: "Gone", group: "Client error" },
  { code: 415, name: "Unsupported Media Type", group: "Client error" },
  { code: 422, name: "Unprocessable Entity", group: "Client error" },
  { code: 429, name: "Too Many Requests", group: "Client error" },
  { code: 500, name: "Internal Server Error", group: "Server error" },
  { code: 502, name: "Bad Gateway", group: "Server error" },
  { code: 503, name: "Service Unavailable", group: "Server error" },
  { code: 504, name: "Gateway Timeout", group: "Server error" },
];

export function lookupHttpStatus(query: string): { code: number; name: string; group: string }[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return HTTP_STATUS;
  return HTTP_STATUS.filter(
    (item) =>
      String(item.code).includes(needle) ||
      item.name.toLowerCase().includes(needle) ||
      item.group.toLowerCase().includes(needle),
  );
}
