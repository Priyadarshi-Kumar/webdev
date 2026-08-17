import { isPortfolioSection, portfolioSections, type PortfolioSectionId } from "@webdev/widgets";
import { render } from "vike/abort";
import type { PageContextServer } from "vike/types";

export type Data = {
  section: PortfolioSectionId;
  title: string;
};

export function data(pageContext: PageContextServer): Data {
  const section = pageContext.routeParams.section ?? "";
  if (!isPortfolioSection(section) || section === "projects") throw render(404);
  const meta = portfolioSections.find((item) => item.id === section);
  if (!meta) throw render(404);
  return { section, title: meta.label };
}
