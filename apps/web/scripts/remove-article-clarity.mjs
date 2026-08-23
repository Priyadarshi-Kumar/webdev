/**
 * Removes "## Read this in order" sections and **Plain English:** lines from topic MDX.
 * Usage: node remove-article-clarity.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const topicsDir = path.join(__dirname, "../content/topics");

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;
  return { frontmatter: match[1], body: match[2] };
}

function stripClarity(body) {
  let next = body;

  // Drop the whole "Read this in order" section.
  next = next.replace(/\n## Read this in order\n[\s\S]*?(?=\n## )/, "\n");

  // Drop standalone Plain English lines.
  next = next.replace(/^\*\*Plain English:\*\*[^\n]*\n\n?/gm, "");

  // Drop leftover clarity suffixes in list items or prose.
  next = next.replace(/ — concepts first, then code\./g, "");
  next = next.replace(/ — definition, example, and where you will see it\./g, "");
  next = next.replace(/ — explained simply with an example\./g, "");
  next = next.replace(/ — explained with a short example\./g, "");
  next = next.replace(/Follow these steps in order — each builds on the last\./g, "");
  next = next.replace(/Short answers to reuse in interviews or reviews\./g, "");
  next = next.replace(/Common mistakes and how to fix them\./g, "");
  next = next.replace(/Side-by-side comparison so you can pick the right tool\./g, "");
  next = next.replace(/Terms and mental model before the examples\./g, "");
  next = next.replace(/When this applies — and when to skip it\./g, "");
  next = next.replace(/The main API or commands you will actually use\./g, "");
  next = next.replace(/Structure that scales as the app grows\./g, "");
  next = next.replace(/How this repo uses the idea today\./g, "");
  next = next.replace(/How to test this behaviour in code\./g, "");
  next = next.replace(/Quick map of the whole note — skim first or review last\./g, "");
  next = next.replace(/The mess we are fixing — anomalies and duplicated data\./g, "");

  // Collapse triple+ blank lines down to double.
  next = next.replace(/\n{3,}/g, "\n\n");

  return next.trimEnd() + "\n";
}

let changed = 0;

for (const name of fs.readdirSync(topicsDir).filter((f) => f.endsWith(".mdx")).sort()) {
  const filePath = path.join(topicsDir, name);
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = parseFrontmatter(raw);
  if (!parsed) continue;

  const nextBody = stripClarity(parsed.body);
  if (nextBody === parsed.body) continue;

  fs.writeFileSync(filePath, `---\n${parsed.frontmatter}\n---\n${nextBody}`);
  changed += 1;
  console.log("cleaned:", name);
}

console.log(`\nDone: ${changed} files cleaned`);
