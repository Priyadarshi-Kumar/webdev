import type { ToolMeta } from "@webdev/types";
import { findBySlug } from "@webdev/utils";

export const tools: ToolMeta[] = [
  {
    slug: "json",
    title: "JSON converter",
    description: "Format, minify, and validate JSON in the browser. Nothing is uploaded.",
    featured: true,
  },
  {
    slug: "base64",
    title: "Base64 encoder",
    description: "Encode and decode text with Base64. Handy for tokens, data URIs, and quick debugging.",
    featured: true,
  },
  {
    slug: "url-encode",
    title: "URL encoder",
    description: "Percent-encode or decode URI components for query strings and path segments.",
    featured: true,
  },
  {
    slug: "html-entities",
    title: "HTML entities",
    description: "Escape or unescape HTML entities so text is safe to paste into markup.",
  },
  {
    slug: "jwt",
    title: "JWT decoder",
    description: "Inspect JWT header and payload JSON. Signature is not verified.",
    featured: true,
  },
  {
    slug: "uuid",
    title: "UUID generator",
    description: "Generate RFC 4122 v4 UUIDs in the browser with crypto.getRandomValues.",
    featured: true,
  },
  {
    slug: "hash",
    title: "Text hasher",
    description: "Compute SHA-256 or SHA-1 hashes from any string using the Web Crypto API.",
    featured: true,
  },
  {
    slug: "timestamp",
    title: "Unix timestamp",
    description: "Convert between Unix seconds or milliseconds and human-readable dates.",
    featured: true,
  },
  {
    slug: "regex",
    title: "Regex tester",
    description: "Try a regular expression against sample text and list every match.",
    featured: true,
  },
  {
    slug: "color",
    title: "Color converter",
    description: "Convert between hex and rgb() color values for CSS and design tokens.",
  },
  {
    slug: "case",
    title: "Case converter",
    description: "Switch identifiers between camelCase, snake_case, kebab-case, and more.",
  },
  {
    slug: "slugify",
    title: "Slug generator",
    description: "Turn titles into URL-friendly slugs with lowercase letters and hyphens.",
  },
  {
    slug: "diff",
    title: "Text diff",
    description: "Compare two blocks of text line by line with simple +/- markers.",
  },
  {
    slug: "csv-json",
    title: "CSV ↔ JSON",
    description: "Convert a header row CSV file to JSON or flatten JSON arrays back to CSV.",
    featured: true,
  },
  {
    slug: "password",
    title: "Password generator",
    description: "Create strong random passwords with adjustable length and symbol sets.",
    featured: true,
  },
  {
    slug: "bytes",
    title: "Byte formatter",
    description: "Parse sizes like 1.5 MB into bytes or format raw byte counts for humans.",
  },
  {
    slug: "semver",
    title: "Semver compare",
    description: "Compare two semantic version strings and see which is greater.",
  },
];

export function getTool(slug: string): ToolMeta | undefined {
  return findBySlug(tools, slug);
}

export function getFeaturedTools(): ToolMeta[] {
  return tools.filter((tool) => tool.featured);
}
