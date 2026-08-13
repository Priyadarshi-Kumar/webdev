import { projects } from "@webdev/widgets/portfolio-data";

export async function onBeforePrerenderStart() {
  return projects.map((project) => `/portfolio/projects/${project.slug}`);
}
