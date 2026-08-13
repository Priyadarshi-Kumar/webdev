import { render } from "vike/abort";
import type { PageContextServer } from "vike/types";
import { getPostMeta } from "@webdev/widgets/blog-data";
import type { TocEntry } from "@webdev/utils";

export type Data = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  toc: TocEntry[];
};

export function data(pageContext: PageContextServer): Data {
  const slug = pageContext.routeParams.slug;
  const post = getPostMeta(slug);
  if (!post) throw render(404);
  const { title, description, date, tags, toc } = post;
  return { slug, title, description, date, tags, toc };
}
