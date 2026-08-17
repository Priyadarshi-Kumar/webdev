import type { ToolGroup, ToolMeta } from "@webdev/types";
import { findBySlug } from "@webdev/utils";

export const toolGroups: { id: ToolGroup; label: string }[] = [
  { id: "encode", label: "Encode" },
  { id: "format", label: "Format" },
  { id: "generate", label: "Generate" },
  { id: "inspect", label: "Inspect" },
];

export const tools: ToolMeta[] = [
  {
    slug: "json",
    title: "JSON converter",
    description: "Format, minify, and validate JSON in the browser. Nothing is uploaded.",
    group: "format",
    featured: true,
  },
  {
    slug: "base64",
    title: "Base64 encoder",
    description: "Encode and decode text with Base64. Handy for tokens, data URIs, and quick debugging.",
    group: "encode",
    featured: true,
  },
  {
    slug: "url-encode",
    title: "URL encoder",
    description: "Percent-encode or decode URI components for query strings and path segments.",
    group: "encode",
    featured: true,
  },
  {
    slug: "html-entities",
    title: "HTML entities",
    description: "Escape or unescape HTML entities so text is safe to paste into markup.",
    group: "encode",
  },
  {
    slug: "jwt",
    title: "JWT decoder",
    description: "Inspect JWT header and payload JSON. Signature is not verified.",
    group: "encode",
    featured: true,
  },
  {
    slug: "uuid",
    title: "UUID generator",
    description: "Generate RFC 4122 v4 UUIDs in the browser with crypto.getRandomValues.",
    group: "generate",
    featured: true,
  },
  {
    slug: "hash",
    title: "Text hasher",
    description: "Compute SHA-256 or SHA-1 hashes from any string using the Web Crypto API.",
    group: "inspect",
    featured: true,
  },
  {
    slug: "timestamp",
    title: "Unix timestamp",
    description: "Convert between Unix seconds or milliseconds and human-readable dates.",
    group: "inspect",
    featured: true,
  },
  {
    slug: "regex",
    title: "Regex tester",
    description: "Try a regular expression against sample text and list every match.",
    group: "inspect",
    featured: true,
  },
  {
    slug: "color",
    title: "Color converter",
    description: "Convert between hex and rgb() color values for CSS and design tokens.",
    group: "format",
  },
  {
    slug: "case",
    title: "Case converter",
    description: "Switch identifiers between camelCase, snake_case, kebab-case, and more.",
    group: "format",
  },
  {
    slug: "slugify",
    title: "Slug generator",
    description: "Turn titles into URL-friendly slugs with lowercase letters and hyphens.",
    group: "format",
  },
  {
    slug: "diff",
    title: "Text diff",
    description: "Compare two blocks of text line by line with simple +/- markers.",
    group: "inspect",
  },
  {
    slug: "csv-json",
    title: "CSV ↔ JSON",
    description: "Convert a header row CSV file to JSON or flatten JSON arrays back to CSV.",
    group: "format",
    featured: true,
  },
  {
    slug: "password",
    title: "Password generator",
    description: "Create strong random passwords with adjustable length and symbol sets.",
    group: "generate",
    featured: true,
  },
  {
    slug: "bytes",
    title: "Byte formatter",
    description: "Parse sizes like 1.5 MB into bytes or format raw byte counts for humans.",
    group: "format",
  },
  {
    slug: "semver",
    title: "Semver compare",
    description: "Compare two semantic version strings and see which is greater.",
    group: "inspect",
  },
  {
    slug: "cron",
    title: "Cron explainer",
    description: "Break a 5- or 6-field cron expression into minute, hour, day, month, and weekday.",
    group: "inspect",
    featured: true,
  },
  {
    slug: "number-base",
    title: "Number base",
    description: "Convert integers between decimal, hex, octal, and binary.",
    group: "format",
  },
  {
    slug: "url-inspect",
    title: "URL inspector",
    description: "Split an absolute URL into host, path, query params, hash, and origin.",
    group: "inspect",
    featured: true,
  },
  {
    slug: "lines",
    title: "Line tools",
    description: "Sort, unique, reverse, or count lines of text in the browser.",
    group: "format",
  },
  {
    slug: "chmod",
    title: "chmod calculator",
    description: "Convert Unix file modes between octal (755) and symbolic (rwxr-xr-x).",
    group: "inspect",
  },
  {
    slug: "http-status",
    title: "HTTP status codes",
    description: "Look up common HTTP status codes by number, name, or class.",
    group: "inspect",
  },
];

export function getTool(slug: string): ToolMeta | undefined {
  return findBySlug(tools, slug);
}

export function getFeaturedTools(): ToolMeta[] {
  return tools.filter((tool) => tool.featured);
}
