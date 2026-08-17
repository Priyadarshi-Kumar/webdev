import { getFirstNote } from "@webdev/widgets/blog-data";
import type { TocEntry } from "@webdev/utils";

export type Data = {
  slug?: string;
  toc: TocEntry[];
};

export function data(): Data {
  const post = getFirstNote();
  if (!post) return { toc: [] };
  return { slug: post.slug, toc: post.toc };
}
