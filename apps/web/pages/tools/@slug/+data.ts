import { render } from "vike/abort";
import type { PageContextServer } from "vike/types";
import { getTool } from "@webdev/tools";

export type Data = {
  slug: string;
  title: string;
  description: string;
};

export function data(pageContext: PageContextServer): Data {
  const slug = pageContext.routeParams.slug;
  const tool = getTool(slug);
  if (!tool) throw render(404);
  return { slug: tool.slug, title: tool.title, description: tool.description };
}
