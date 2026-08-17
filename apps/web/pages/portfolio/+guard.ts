import { redirect } from "vike/abort";
import type { PageContextServer } from "vike/types";

export function guard(pageContext: PageContextServer) {
  const path = pageContext.urlPathname.replace(/\/$/, "") || "/";
  if (path === "/portfolio") {
    throw redirect("/portfolio/experience");
  }
}
