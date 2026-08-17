import type { PageContext } from "vike/types";

export default (pageContext: PageContext) =>
  pageContext.is404
    ? "That URL is not on this site. Head home, or jump to portfolio, blog, or tools."
    : "This page hit an unexpected error. Refresh, or pick another destination.";
