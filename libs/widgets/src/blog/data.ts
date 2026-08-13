import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { PostFrontmatter } from "@webdev/types";
import { extractToc, parseFrontmatter, sortByDateDesc, type TocEntry } from "@webdev/utils";

export type PostIndexEntry = PostFrontmatter & { toc: TocEntry[] };

export function getPostIndex(
  topicsDir = path.join(process.cwd(), "content/topics"),
): PostIndexEntry[] {
  const posts = readdirSync(topicsDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const src = readFileSync(path.join(topicsDir, file), "utf8");
      return { ...parseFrontmatter(src), toc: extractToc(src) };
    });
  return sortByDateDesc(posts);
}

export function getPostMeta(slug: string, topicsDir?: string): PostIndexEntry | undefined {
  return getPostIndex(topicsDir).find((post) => post.slug === slug);
}
