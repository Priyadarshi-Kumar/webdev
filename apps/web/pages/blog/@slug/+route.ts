import type { PageContext } from "vike/types";

const RESERVED = new Set(["jargon", "external"]);

export default (pageContext: PageContext) => {
  const match = /^\/blog\/([^/]+)\/?$/.exec(pageContext.urlPathname);
  if (!match) return false;
  const slug = match[1];
  if (!slug || RESERVED.has(slug)) return false;
  return { routeParams: { slug } };
};
