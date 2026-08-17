import type { Site } from "@webdev/types";

export const SITE: Site = {
  name: "Priyadarshi Kumar",
  shortName: "PK",
  role: "Full-stack React & TypeScript engineer",
  tagline:
    "I ship React products end to end — typed UI, solid state, clean architecture — and I write down how so your team can move faster.",
  description:
    "Priyadarshi Kumar — full-stack React & TypeScript engineer in India, open to remote. Portfolio, technical writing, and proof-of-work projects.",
  email: "hello@priyadarshikumar.dev",
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
