import type { Site } from "@webdev/types";

export const SITE: Site = {
  name: "Priyadarshi Kumar",
  shortName: "PK",
  role: "Lead Software Engineer · Full-Stack",
  tagline:
    "6+ years shipping full-stack products at scale — React, TypeScript, Node.js, Python, FastAPI, MCP, analytics dashboards, fintech, mobility, and EDA tooling. I own features end to end and write down how.",
  description:
    "Priyadarshi Kumar — Lead Full-Stack Engineer in Bangalore. React, TypeScript, Node.js, Python, FastAPI, MCP, Redux, Tekion, Setu, Yulu, Maieutic Semiconductors.",
  email: "priyadarshigeorgian@gmail.com",
  url: "https://priyadarshi.dev",
  socials: {
    github: "https://github.com/Priyadarshi-Kumar",
    linkedin: "https://www.linkedin.com/in/priyadarshikumar",
  },
};

export function getSiteUrl() {
  const fromVite = import.meta.env.VITE_SITE_URL as string | undefined;
  return fromVite || SITE.url;
}
