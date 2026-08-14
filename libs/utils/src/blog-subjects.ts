import type { PostFrontmatter } from "@webdev/types";

export const BLOG_SUBJECTS = [
  { id: "react", label: "React", tags: ["react", "hooks"] },
  { id: "browser", label: "Browser APIs", tags: ["browser", "web-apis"] },
  { id: "mcp", label: "MCP & AI", tags: ["mcp", "ai"] },
  { id: "nx", label: "Nx & monorepos", tags: ["nx", "monorepo"] },
  { id: "packages", label: "Package managers", tags: ["pnpm", "npm", "yarn", "nodejs"] },
  { id: "tooling", label: "Tooling", tags: ["tooling", "javascript"] },
] as const;

export type BlogSubjectId = (typeof BLOG_SUBJECTS)[number]["id"];

export type BlogSubjectGroup = {
  id: BlogSubjectId;
  label: string;
  posts: PostFrontmatter[];
};

export function resolveSubject(tags: string[]): BlogSubjectId {
  const tagSet = new Set(tags);
  for (const subject of BLOG_SUBJECTS) {
    if (subject.tags.some((tag) => tagSet.has(tag))) return subject.id;
  }
  return "tooling";
}

export function groupPostsBySubject(posts: PostFrontmatter[]): BlogSubjectGroup[] {
  const buckets = new Map<BlogSubjectId, PostFrontmatter[]>();
  for (const post of posts) {
    const id = resolveSubject(post.tags);
    const list = buckets.get(id) ?? [];
    list.push(post);
    buckets.set(id, list);
  }

  return BLOG_SUBJECTS.filter((subject) => buckets.has(subject.id)).map((subject) => ({
    id: subject.id,
    label: subject.label,
    posts: buckets.get(subject.id) ?? [],
  }));
}
