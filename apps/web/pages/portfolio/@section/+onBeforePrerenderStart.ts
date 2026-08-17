import { portfolioSections } from "@webdev/widgets";

export async function onBeforePrerenderStart() {
  return portfolioSections.filter((item) => item.id !== "projects").map((item) => item.href);
}
