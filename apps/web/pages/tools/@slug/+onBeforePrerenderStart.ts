import { tools } from "@webdev/tools";

export async function onBeforePrerenderStart() {
  return tools.map((tool) => `/tools/${tool.slug}`);
}
