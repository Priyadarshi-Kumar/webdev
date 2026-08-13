import type { PostFrontmatter } from "@webdev/types";

function unquote(value: string) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export function parseFrontmatter(src: string): PostFrontmatter {
  const match = src.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    throw new Error("MDX file is missing frontmatter");
  }
  const block = match[1];
  const title = unquote(block.match(/^title:\s*(.+)$/m)?.[1] ?? "");
  const description = unquote(block.match(/^description:\s*(.+)$/m)?.[1] ?? "");
  const slug = unquote(block.match(/^slug:\s*(.+)$/m)?.[1] ?? "");
  const date = unquote(block.match(/^date:\s*(.+)$/m)?.[1] ?? "");
  const tagsBlock = block.match(/^tags:\n((?:  - .+\n?)+)/m)?.[1] ?? "";
  const tags = tagsBlock
    .split("\n")
    .map((line) => line.replace(/^\s*-\s*/, "").trim())
    .filter(Boolean);
  return { title, description, slug, date, tags };
}
