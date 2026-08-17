import { SITE } from "@webdev/widgets/config";
import type { PageContext } from "vike/types";
import type { Data } from "./+data";

const copy: Record<string, string> = {
  about: `About ${SITE.name} — work, stack, and selected projects.`,
  experience: `Experience for ${SITE.name} — roles at Maieutic, Tekion, Setu, and Yulu.`,
  skills: `Skills for ${SITE.name} — languages, frameworks, browser APIs, and web security.`,
  education: `Education for ${SITE.name} — Computer Science Engineering at GIT, Belgaum.`,
};

export default (pageContext: PageContext<Data>) =>
  copy[pageContext.data.section] ?? `Portfolio · ${SITE.name}`;
