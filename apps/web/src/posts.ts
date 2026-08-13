import type { PostFrontmatter } from "@webdev/types";
import { sortByDateDesc } from "@webdev/utils";
import type { ComponentType } from "react";

export type Post = PostFrontmatter & {
  Component: ComponentType;
};

const modules = import.meta.glob<{ default: ComponentType; frontmatter: PostFrontmatter }>(
  "../content/topics/*.mdx",
  { eager: true },
);

function toPost(mod: { default: ComponentType; frontmatter: PostFrontmatter }): Post {
  return { ...mod.frontmatter, Component: mod.default };
}

export function getAllPosts(): Post[] {
  return sortByDateDesc(Object.values(modules).map(toPost));
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getLatestPosts(count = 3): Post[] {
  return getAllPosts()
    .filter((post) => !post.tags?.includes("glossary"))
    .slice(0, count);
}
