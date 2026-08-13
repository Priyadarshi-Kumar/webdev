export type TocEntry = {
  id: string;
  text: string;
  children: TocEntry[];
};

const PUNCT = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g;

export function slugifyHeading(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(PUNCT, "")
    .replace(/\s+/g, "-");
}

export function uniqueHeadingId(text: string, used: Map<string, number>): string {
  const base = slugifyHeading(text) || "section";
  const count = used.get(base) ?? 0;
  used.set(base, count + 1);
  return count === 0 ? base : `${base}-${count}`;
}

export function plainHeadingText(raw: string): string {
  return raw
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function stripFencedCode(src: string): string {
  return src.replace(/```[\s\S]*?```/g, "");
}

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function hastText(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(hastText).join("");
}

/** Rehype plugin: give h2/h3 the same ids `extractToc` emits. */
export function rehypeHeadingIds() {
  return (tree: HastNode) => {
    const used = new Map<string, number>();
    const walk = (node: HastNode) => {
      if (node.type === "element" && (node.tagName === "h2" || node.tagName === "h3")) {
        const text = hastText(node).trim();
        if (text) {
          node.properties = { ...node.properties, id: uniqueHeadingId(text, used) };
        }
      }
      for (const child of node.children ?? []) walk(child);
    };
    walk(tree);
  };
}

export function extractToc(mdx: string): TocEntry[] {
  if (typeof mdx !== "string") return [];
  const withoutFrontmatter = mdx.replace(/^---\n[\s\S]*?\n---\n?/, "");
  const used = new Map<string, number>();
  const roots: TocEntry[] = [];
  let current: TocEntry | undefined;

  for (const line of stripFencedCode(withoutFrontmatter).split("\n")) {
    const match = /^(#{2,3}) (.+)$/.exec(line);
    if (!match) continue;
    const depth = match[1].length;
    const text = plainHeadingText(match[2]);
    if (!text) continue;
    const entry: TocEntry = { id: uniqueHeadingId(text, used), text, children: [] };
    if (depth === 2) {
      roots.push(entry);
      current = entry;
      continue;
    }
    if (current) current.children.push(entry);
    else roots.push(entry);
  }

  return roots;
}
