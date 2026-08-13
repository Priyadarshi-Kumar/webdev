import { getPostIndex } from "@webdev/widgets/blog-data";

export async function onBeforePrerenderStart() {
  return getPostIndex().map((post) => `/blog/${post.slug}`);
}
