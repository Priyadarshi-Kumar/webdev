/**
 * (Re)builds "## Read this in order" and **Plain English:** lines on topic MDX files.
 * Usage: node add-article-clarity.mjs [--force]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const topicsDir = path.join(__dirname, "../content/topics");
const force = process.argv.includes("--force");

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;
  const tags = [...match[1].matchAll(/^\s*-\s+(.+)$/gm)].map((m) => m[1].trim());
  return { frontmatter: match[1], body: match[2], tags };
}

function isGlossary(tags) {
  return tags.includes("glossary");
}

function stripPlainEnglish(content) {
  return content.replace(/^\*\*Plain English:\*\*[^\n]*\n\n?/m, "");
}

function describeSection(heading, isGlossaryNote) {
  const h = heading.trim();
  const lower = h.toLowerCase();

  const rules = [
    [/roadmap|at a glance|cheat sheet|checklist|interview/, () => `Quick map of the whole note — skim first or review last.`],
    [/normal form|^1nf|^2nf|^3nf|^bcnf|^4nf|^5nf/, () => `What this normal form means and how to spot violations.`],
    [/^step \d|^step 0/, () => `The example schema at this stage of the walkthrough.`],
    [/^what problem|^why /, () => `The mess we are fixing — anomalies and duplicated data.`],
    [/vocabulary|mental model|cast|pipeline|layers/, () => `Terms and mental model before the examples.`],
    [/^what .+ is|^what is|^what are|^what's/, () => `Clear definition, then a minimal example.`],
    [/^how to|^how do|^how /, () => `Practical steps you can follow in order.`],
    [/^when to|^when denormal|^when /, () => `When this applies — and when to skip it.`],
    [/ vs | versus |compare/, () => `Side-by-side comparison so you can pick the right tool.`],
    [/pitfall|mistake|gotcha|common bug/, () => `What goes wrong and how to avoid it.`],
    [/\btesting\b|\btest suite\b|^testing |^async tests|^fake timers/, () => `How to test this behaviour in code.`],
    [/middleware|slice|architecture|pattern/, () => `Structure that scales as the app grows.`],
    [/example|walkthrough|tiny |mini |demo/, () => `Runnable code or data to copy.`],
    [/api|core api|commands/, () => `The main API or commands you will actually use.`],
    [/this site|on this site/, () => `How this repo uses the idea today.`],
  ];

  for (const [pattern, fn] of rules) {
    if (pattern.test(lower)) return fn();
  }

  if (isGlossaryNote) {
    if (lower.includes("ci") || lower.includes("freeze")) return `Why CI must install from the lockfile exactly.`;
    if (lower.includes("migrat")) return `Switching tools without leaving two lockfiles in git.`;
    if (lower.includes("one file")) return `One lockfile per repo — npm, Yarn, or pnpm, not all three.`;
    return `${h} — explained with a short example.`;
  }

  return `${h} — concepts first, then code.`;
}

function plainEnglishLine(heading, isGlossaryNote) {
  const h = heading.trim();
  const lower = h.toLowerCase();

  if (lower === "read this in order") return null;
  if (/^what .+ is|^what is|^what are/.test(lower)) {
    return `**Plain English:** ${h.replace(/\?$/, "")}, explained simply with an example.`;
  }
  if (/^how to|^how do|^how /.test(lower)) {
    return `**Plain English:** Follow these steps in order — each builds on the last.`;
  }
  if (/interview|cheat sheet|checklist/.test(lower)) {
    return `**Plain English:** Short answers to reuse in interviews or reviews.`;
  }
  if (/pitfall|mistake|gotcha/.test(lower)) {
    return `**Plain English:** Common mistakes and how to fix them.`;
  }
  if (isGlossaryNote) {
    return `**Plain English:** ${h} — definition, example, and where you will see it.`;
  }
  return `**Plain English:** ${describeSection(h, false)}`;
}

function splitSections(body) {
  const parts = body.split(/^## /m);
  const intro = parts[0].trimEnd();
  const sections = parts.slice(1).map((chunk) => {
    const nl = chunk.indexOf("\n");
    const title = nl === -1 ? chunk.trim() : chunk.slice(0, nl).trim();
    const rest = nl === -1 ? "" : chunk.slice(nl + 1);
    return { title, rest };
  });
  return { intro, sections };
}

function buildReadOrder(sections, isGlossaryNote) {
  const items = sections.filter((s) => s.title !== "Read this in order");
  if (items.length <= 1) return "";

  const lines = items.map((s, i) => `${i + 1}. **${s.title}** — ${describeSection(s.title, isGlossaryNote)}`);
  const lead = isGlossaryNote
    ? items.length <= 3
      ? "Short jargon note — read top to bottom:\n\n"
      : "Read these sections in order:\n\n"
    : "Work through these sections in order:\n\n";

  return `\n\n## Read this in order\n\n${lead}${lines.join("\n")}\n`;
}

function processBody(body, glossary, shouldForce) {
  if (body.includes("## Read this in order") && !shouldForce) return body;

  let working = body;
  if (shouldForce && body.includes("## Read this in order")) {
    working = body.replace(/\n## Read this in order\n[\s\S]*?(?=\n## )/, "\n");
  }

  const { intro, sections } = splitSections(working);
  if (sections.length === 0) return body;

  const contentSections = sections.filter((s) => s.title !== "Read this in order");
  const orderBlock = buildReadOrder(contentSections, glossary);

  const rebuilt = contentSections.map(({ title, rest }) => {
    const cleaned = stripPlainEnglish(rest.trimStart());
    const line = plainEnglishLine(title, glossary);
    const prefix = line ? `${line}\n\n` : "";
    return `## ${title}\n\n${prefix}${cleaned}`.trimEnd();
  });

  return `${intro}${orderBlock}\n${rebuilt.join("\n\n")}\n`;
}

let changed = 0;

for (const name of fs.readdirSync(topicsDir).filter((f) => f.endsWith(".mdx")).sort()) {
  const filePath = path.join(topicsDir, name);
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = parseFrontmatter(raw);
  if (!parsed) continue;

  const nextBody = processBody(parsed.body, isGlossary(parsed.tags), force);
  if (nextBody === parsed.body) continue;

  fs.writeFileSync(filePath, `---\n${parsed.frontmatter}\n---\n${nextBody}`);
  changed += 1;
  console.log(force ? "refreshed:" : "updated:", name);
}

console.log(`\nDone: ${changed} files ${force ? "refreshed" : "updated"}`);
