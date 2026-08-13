import type { Profile, Project } from "@webdev/types";
import { findBySlug } from "@webdev/utils";

export const profile: Profile = {
  name: "Priyadarshi Kumar",
  location: "India",
  bio: [
    "I build web apps with React and TypeScript, and I care about how they feel — fast first paint, clear structure, and interfaces people can actually scan.",
    "This site is my public notebook: articles I can reopen later, a few tools I use myself, and a short record of work.",
  ],
  stack: ["TypeScript", "React", "Vite", "Node.js", "Tailwind CSS", "Nx"],
  experience: [
    {
      company: "Your company",
      role: "Software engineer",
      period: "2023 — present",
      detail: "Replace this with your current role, the product you ship, and the stack you own.",
    },
    {
      company: "Previous team",
      role: "Frontend engineer",
      period: "2021 — 2023",
      detail: "Replace this with a past role. One or two sentences is enough.",
    },
  ],
};

export const projects: Project[] = [
  {
    slug: "this-site",
    title: "Personal site",
    summary: "A static React site with a blog, portfolio, and browser tools — SSG for posts, SPA for utilities.",
    year: "2026",
    tags: ["React", "Vike", "Nx"],
    role: "Design and engineering",
  },
  {
    slug: "add-your-work",
    title: "Add a project",
    summary: "Edit libs/widgets/src/portfolio/data.ts and this card becomes a real case study.",
    year: "2026",
    tags: ["Portfolio"],
    role: "Placeholder",
  },
];

export function getProject(slug: string): Project | undefined {
  return findBySlug(projects, slug);
}
