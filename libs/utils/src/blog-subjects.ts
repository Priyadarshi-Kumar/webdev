import type { PostFrontmatter } from "@webdev/types";

export const BLOG_SUBJECTS = [
  { id: "react", label: "React", tags: ["react", "hooks", "zustand", "state-management"] },
  { id: "javascript", label: "JavaScript", tags: ["javascript"] },
  { id: "browser", label: "Browser APIs", tags: ["browser", "web-apis", "pwa"] },
  { id: "llm", label: "LLM", tags: ["llm", "mcp", "ai"] },
  { id: "nx", label: "Nx & monorepos", tags: ["nx", "monorepo"] },
  { id: "packages", label: "Package managers", tags: ["pnpm", "npm", "yarn", "nodejs"] },
  { id: "backend", label: "Backend", tags: ["python", "fastapi", "api", "database", "sql"] },
  { id: "tooling", label: "Tooling", tags: ["tooling"] },
] as const;

export type BlogSubjectId = (typeof BLOG_SUBJECTS)[number]["id"];

const SUBJECT_IDS = new Set<string>(BLOG_SUBJECTS.map((subject) => subject.id));

export type BlogSubjectGroup = {
  id: BlogSubjectId;
  label: string;
  posts: PostFrontmatter[];
};

export function resolveSubject(tags: string[], explicit?: string): BlogSubjectId {
  if (explicit && SUBJECT_IDS.has(explicit)) return explicit as BlogSubjectId;

  const tagSet = new Set(tags);
  for (const subject of BLOG_SUBJECTS) {
    if (subject.id === "javascript") continue;
    if (subject.tags.some((tag) => tagSet.has(tag))) return subject.id;
  }
  if (tagSet.has("javascript")) return "javascript";
  return "tooling";
}

export function resolvePostSubject(post: Pick<PostFrontmatter, "tags" | "subject">): BlogSubjectId {
  return resolveSubject(post.tags, post.subject);
}

export function subjectLabel(id: BlogSubjectId): string {
  return BLOG_SUBJECTS.find((subject) => subject.id === id)?.label ?? id;
}

export function groupPostsBySubject(posts: PostFrontmatter[]): BlogSubjectGroup[] {
  const buckets = new Map<BlogSubjectId, PostFrontmatter[]>();
  for (const post of posts) {
    const id = resolvePostSubject(post);
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
