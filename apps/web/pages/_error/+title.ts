import type { PageContext } from "vike/types";

export default (pageContext: PageContext) =>
  pageContext.is404 ? "Page not found" : "Something went wrong";
