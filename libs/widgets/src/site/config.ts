import type { Site } from "@webdev/types";

export const SITE: Site = {
  name: "Priyadarshi Kumar",
  shortName: "PK",
  role: "Lead Software Engineer · Front-End",
  tagline:
    "6+ years shipping React at scale — analytics dashboards, fintech, mobility, and EDA tooling. I own features end to end and write down how.",
  description:
    "Priyadarshi Kumar — Lead Front-End Engineer in Bangalore. React, TypeScript, Redux, Tekion, Setu, Yulu, Maieutic Semiconductors.",
  email: "priyadarshigeorgian@gmail.com",
  url: "http://localhost:3000",
  socials: {
    github: "https://github.com/Priyadarshi-Kumar",
    linkedin: "https://www.linkedin.com/in/priyadarshikumar",
  },
};

export function getSiteUrl() {
  const fromVite = import.meta.env.VITE_SITE_URL as string | undefined;
  return fromVite || SITE.url;
}
