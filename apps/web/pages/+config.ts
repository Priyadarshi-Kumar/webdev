import type { Config } from "vike/types";
import vikeReact from "vike-react/config";
import { SITE } from "@webdev/widgets/config";

const config: Config = {
  title: `${SITE.name} — ${SITE.role}`,
  description: SITE.description,
  prerender: true,
  extends: [vikeReact],
  htmlAttributes: {
    lang: "en",
    class: "dark",
  },
};

export default config;
