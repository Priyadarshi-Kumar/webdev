import { isPortfolioSection } from "@webdev/widgets";
import type { PageContext } from "vike/types";

export default (pageContext: PageContext) => {
  const match = /^\/portfolio\/([^/]+)\/?$/.exec(pageContext.urlPathname);
  if (!match) return false;
  const section = match[1];
  if (section === "projects" || !isPortfolioSection(section)) return false;
  return { routeParams: { section } };
};
