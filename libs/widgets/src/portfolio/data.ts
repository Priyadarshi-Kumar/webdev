import type { Profile, Project } from "@webdev/types";
import { findBySlug } from "@webdev/utils";

export const profile: Profile = {
  name: "Priyadarshi Kumar",
  location: "India · open to remote",
  headline: "Full-stack React & TypeScript engineer",
  availability: "Open to full-time & contract",
  bio: [
    "I build web products end to end — React UI, typed state, Node APIs, and the CI that ships them. I care about fast first paint, code you can extend, and interfaces recruiters and users can scan in seconds.",
    "This site is my proof of work: an Nx monorepo with SSR, a technical blog, browser tools, and the same patterns I would use on your team.",
  ],
  highlights: [
    "Ship full features — UI, state, APIs, and deploy — not isolated JSX tickets.",
    "Write the docs I wish existed: {notesCount}+ technical articles on React, Zustand, Nx, MCP, and browser APIs.",
    "Structure repos to scale: Nx project graph, shared libraries, and clear package boundaries.",
    "Based in India, comfortable collaborating async with global teams in English.",
  ],
  skillGroups: [
    {
      label: "Frontend",
      skills: ["React 19", "TypeScript", "Zustand", "Tailwind CSS", "Vike", "HTML & CSS"],
    },
    {
      label: "Backend & data",
      skills: ["Node.js", "REST APIs", "JSON-RPC", "Firebase"],
    },
    {
      label: "Engineering",
      skills: ["Nx monorepo", "pnpm", "Vite", "Git", "Netlify", "CI/CD"],
    },
  ],
  stack: [
    "TypeScript",
    "React",
    "Node.js",
    "Zustand",
    "Nx",
    "Vite",
    "Tailwind CSS",
    "pnpm",
    "Netlify",
  ],
  experience: [
    {
      company: "Product engineering & open source",
      role: "Full-stack software engineer",
      period: "2020 — present",
      detail:
        "Design and ship React/TypeScript apps from UI through deployment. Built this Nx monorepo (Vike SSR, Zustand, technical blog, browser tools), explored Web Storage APIs, and prototyped real-time chat with modern React patterns.",
    },
    {
      company: "Independent projects",
      role: "Frontend engineer",
      period: "2017 — 2020",
      detail:
        "Shipped production-style apps — Slack, Trello, and e-commerce clones — with React and Firebase. Practiced component architecture, Context/reducers, responsive layout, and turning tutorials into working products.",
    },
  ],
};

export const projects: Project[] = [
  {
    slug: "this-site",
    title: "Personal platform (this site)",
    summary:
      "Nx monorepo with Vike SSR, Zustand state, MDX blog, portfolio, and browser tools — the same stack I would bring to a product team.",
    year: "2026",
    tags: ["React", "TypeScript", "Nx", "Vike", "Zustand", "Netlify"],
    role: "Design, architecture, and engineering",
    href: "https://github.com/Priyadarshi-Kumar/webdev",
  },
  {
    slug: "web-storage-apis",
    title: "Web Storage APIs explorer",
    summary:
      "Hands-on demos for localStorage, sessionStorage, IndexedDB, and Cache API — practical browser storage patterns in JavaScript.",
    year: "2025",
    tags: ["JavaScript", "Browser APIs", "IndexedDB"],
    role: "Solo project",
    href: "https://github.com/Priyadarshi-Kumar/web-storage-apis",
  },
  {
    slug: "chat-app",
    title: "Real-time chat app",
    summary:
      "Messaging UI with live updates — React frontend wired to a real-time backend for channels and conversations.",
    year: "2024",
    tags: ["React", "JavaScript", "Real-time"],
    role: "Solo project",
    href: "https://github.com/Priyadarshi-Kumar/chat-app",
  },
  {
    slug: "trello-clone",
    title: "Trello clone",
    summary:
      "Kanban board with drag-and-drop lists and cards — built to practice React Context, reducers, and predictable state updates.",
    year: "2022",
    tags: ["React", "Context API", "Reducers"],
    role: "Solo project",
    href: "https://github.com/Priyadarshi-Kumar/trello-clone",
  },
];

export function getProject(slug: string): Project | undefined {
  return findBySlug(projects, slug);
}
