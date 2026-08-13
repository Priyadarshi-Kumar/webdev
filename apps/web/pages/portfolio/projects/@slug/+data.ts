import { render } from "vike/abort";
import type { PageContextServer } from "vike/types";
import { getProject } from "@webdev/widgets/portfolio-data";

export type Data = {
  slug: string;
  title: string;
  summary: string;
  year: string;
  tags: string[];
  role: string;
  href?: string;
};

export function data(pageContext: PageContextServer): Data {
  const slug = pageContext.routeParams.slug;
  const project = getProject(slug);
  if (!project) throw render(404);
  return project;
}
