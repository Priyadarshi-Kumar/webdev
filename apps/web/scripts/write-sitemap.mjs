import { mkdirSync, readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = process.env.VITE_SITE_URL ?? "http://localhost:3000";

function postSlugs() {
  const dir = path.join(root, "content/topics");
  return readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const src = readFileSync(path.join(dir, file), "utf8");
      return src.match(/^slug:\s*(.+)$/m)?.[1].trim() ?? file.replace(/\.mdx$/, "");
    });
}

function toolSlugs() {
  const toolsDir = path.join(root, "dist/client/tools");
  if (!existsSync(toolsDir)) return ["json"];
  return readdirSync(toolsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

const paths = [
  "/",
  "/portfolio",
  "/portfolio/projects",
  "/portfolio/projects/this-site",
  "/portfolio/projects/add-your-work",
  "/blog",
  ...postSlugs().map((slug) => `/blog/${slug}`),
  "/tools",
  ...toolSlugs().map((slug) => `/tools/${slug}`),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (route) => `  <url>
    <loc>${site}${route === "/" ? "" : route}</loc>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const outDir = path.join(root, "dist/client");
mkdirSync(outDir, { recursive: true });
writeFileSync(path.join(outDir, "sitemap.xml"), xml);
writeFileSync(path.join(outDir, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);
