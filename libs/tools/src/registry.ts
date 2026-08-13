import type { ToolMeta } from "@webdev/types";
import { findBySlug } from "@webdev/utils";

export const tools: ToolMeta[] = [
  {
    slug: "json",
    title: "JSON converter",
    description: "Format, minify, and validate JSON in the browser. Nothing is uploaded.",
    featured: true,
  },
];

export function getTool(slug: string): ToolMeta | undefined {
  return findBySlug(tools, slug);
}

export function getFeaturedTools(): ToolMeta[] {
  return tools.filter((tool) => tool.featured);
}
