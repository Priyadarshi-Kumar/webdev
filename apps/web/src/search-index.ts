import { glossary } from "@webdev/components";
import { tools } from "@webdev/tools";
import type { SearchEntry } from "@webdev/types";
import {
  portfolioSections,
  practiceGroups,
  practiceQuestions,
  profile,
} from "@webdev/widgets";
import { getAllPosts } from "./posts";

const pages: SearchEntry[] = [
  {
    id: "page-home",
    kind: "page",
    title: "Home",
    description: "Landing page — role, stack, and links into the rest of the site.",
    href: "/",
    keywords: ["landing", "index", "priyadarshi"],
  },
  {
    id: "page-portfolio",
    kind: "page",
    title: "Portfolio",
    description: "About, experience, skills, education, and projects.",
    href: "/portfolio",
    keywords: ["cv", "resume", "about", "recruiter"],
  },
  {
    id: "page-notes",
    kind: "page",
    title: "Notes",
    description: "Technical articles on React, the browser, tooling, and backend.",
    href: "/blog",
    keywords: ["blog", "articles", "writing"],
  },
  {
    id: "page-jargon",
    kind: "page",
    title: "Jargon",
    description: "Short glossary notes for dotted terms in the articles.",
    href: "/blog/jargon",
    keywords: ["glossary", "terms"],
  },
  {
    id: "page-practice",
    kind: "page",
    title: "Practice",
    description: "Frontend interview katas grouped by subject, level, and company.",
    href: "/practice",
    keywords: ["kata", "interview", "questions"],
  },
  {
    id: "page-tools",
    kind: "page",
    title: "Tools",
    description: "Browser utilities — JSON, Base64, JWT, regex, timestamps, and more.",
    href: "/tools",
    keywords: ["utilities", "devtools"],
  },
  {
    id: "page-settings",
    kind: "page",
    title: "Settings",
    description: "Theme and appearance.",
    href: "/settings",
    keywords: ["theme", "dark", "light"],
  },
];

function uniqueKeywords(...groups: Array<string | undefined | readonly string[]>): string[] {
  const out = new Set<string>();
  for (const group of groups) {
    if (!group) continue;
    const values = typeof group === "string" ? [group] : group;
    for (const value of values) {
      const trimmed = value.trim();
      if (trimmed) out.add(trimmed);
    }
  }
  return [...out];
}

export function getSearchEntries(): SearchEntry[] {
  const posts = getAllPosts();
  const notes: SearchEntry[] = posts
    .filter((post) => !post.tags?.includes("glossary"))
    .map((post) => ({
      id: `note-${post.slug}`,
      kind: "note" as const,
      title: post.title,
      description: post.description,
      href: `/blog/${post.slug}`,
      keywords: uniqueKeywords(post.tags, post.subject, post.slug),
    }));

  const jargon: SearchEntry[] = posts
    .filter((post) => post.tags?.includes("glossary"))
    .map((post) => {
      const term = Object.values(glossary).find((item) => item.slug === post.slug);
      return {
        id: `jargon-${post.slug}`,
        kind: "jargon" as const,
        title: post.title,
        description: term?.explain ?? post.description,
        href: `/blog/${post.slug}`,
        keywords: uniqueKeywords(post.tags, post.subject, post.slug, "glossary", "jargon"),
      };
    });

  const practice: SearchEntry[] = practiceQuestions.map((question) => {
    const group = practiceGroups.find((item) => item.id === question.group)?.label ?? question.group;
    return {
      id: `practice-${question.slug}`,
      kind: "practice" as const,
      title: question.title,
      description: question.description,
      href: `/practice/${question.slug}`,
      keywords: uniqueKeywords(
        question.slug,
        question.group,
        group,
        question.difficulty,
        question.fnName,
        question.companies,
        "kata",
        "interview",
      ),
    };
  });

  const toolEntries: SearchEntry[] = tools.map((tool) => ({
    id: `tool-${tool.slug}`,
    kind: "tool" as const,
    title: tool.title,
    description: tool.description,
    href: `/tools/${tool.slug}`,
    keywords: uniqueKeywords(tool.slug, tool.group, tool.featured ? "featured" : undefined),
  }));

  const portfolio: SearchEntry[] = [
    ...portfolioSections.map((section) => ({
      id: `portfolio-${section.id}`,
      kind: "portfolio" as const,
      title: section.label,
      description:
        section.id === "about"
          ? profile.headline
          : `${section.label} from the portfolio.`,
      href: section.id === "about" ? "/portfolio" : section.href,
      keywords: uniqueKeywords(section.id, "portfolio", "cv", profile.name),
    })),
  ];

  return [...pages, ...notes, ...jargon, ...practice, ...toolEntries, ...portfolio];
}
