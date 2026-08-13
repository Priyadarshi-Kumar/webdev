import type { Site } from "@webdev/types";

export const SITE: Site = {
  name: "Priyadarshi Kumar",
  shortName: "PK",
  role: "Software engineer",
  tagline: "I write down the web-platform things I keep re-learning — and ship the small tools I wish existed.",
  description:
    "Engineer writing practical notes on React, TypeScript, and tooling. Portfolio, tech blog, and browser utilities.",
  email: "hello@priyadarshikumar.dev",
  url: "http://localhost:3000",
  socials: {
    github: "https://github.com/priyadarshi-kumar",
    linkedin: "https://www.linkedin.com/in/priyadarshikumar",
  },
};

export function getSiteUrl() {
  const fromVite = import.meta.env.VITE_SITE_URL as string | undefined;
  return fromVite || SITE.url;
}
