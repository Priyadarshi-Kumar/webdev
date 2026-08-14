import { ArrowRight } from "lucide-react";
import { Card, Eyebrow, JsonLd, Tag } from "@webdev/components";
import type { PostFrontmatter, ToolMeta } from "@webdev/types";
import { projects } from "../portfolio/data";
import { SITE, getSiteUrl } from "./config";

export function HomePage({
  posts,
  notesCount,
  tools,
}: {
  posts: PostFrontmatter[];
  notesCount: number;
  tools: ToolMeta[];
}) {
  const selectedWork = projects.slice(0, 2);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              name: SITE.name,
              url: getSiteUrl(),
              description: SITE.description,
            },
            {
              "@type": "Person",
              name: SITE.name,
              jobTitle: SITE.role,
              url: getSiteUrl(),
              sameAs: [SITE.socials.github, SITE.socials.linkedin],
            },
          ],
        }}
      />

      <section className="relative overflow-hidden pb-10 pt-2 sm:pb-16 sm:pt-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl dark:bg-sky-400/10" />
        <Eyebrow>Engineer · writing · tools</Eyebrow>
        <h1 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-6xl dark:text-white">
          {SITE.name}
        </h1>
        <p className="page-lead">{SITE.tagline}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="/blog" className="btn-primary">
            Read the blog
          </a>
          <a href="/tools" className="btn-ghost">
            Open tools
          </a>
        </div>
        <div className="mt-8 flex gap-5 text-sm font-medium text-zinc-500">
          <a className="transition hover:text-sky-500" href={SITE.socials.github}>
            GitHub
          </a>
          <a className="transition hover:text-sky-500" href={SITE.socials.linkedin}>
            LinkedIn
          </a>
        </div>
      </section>

      <section className="grid gap-3 border-t border-zinc-200 py-10 sm:grid-cols-3 dark:border-white/10">
        {[
          { label: "Notes", value: String(notesCount) },
          { label: "Focus", value: "React & TS" },
          { label: "Tools", value: String(tools.length) },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 dark:border-white/10 dark:bg-zinc-900/50"
          >
            <p className="text-2xl font-semibold tracking-tight">{item.value}</p>
            <p className="mt-1 text-sm text-zinc-500">{item.label}</p>
          </div>
        ))}
      </section>

      <section className="py-8">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <Eyebrow>Writing</Eyebrow>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">Latest notes</h2>
          </div>
          <a href="/blog" className="inline-flex items-center gap-1 text-sm font-medium text-sky-600 dark:text-sky-400">
            All posts <ArrowRight size={14} />
          </a>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.slug} href={`/blog/${post.slug}`}>
              <p className="text-xs text-zinc-500">{post.date}</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight">{post.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{post.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {post.tags.slice(0, 3).map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-8">
        <Eyebrow>Utilities</Eyebrow>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">Featured tools</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {tools.map((tool) => (
            <Card key={tool.slug} href={`/tools/${tool.slug}`}>
              <h3 className="text-lg font-semibold tracking-tight">{tool.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{tool.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-8">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <Eyebrow>Work</Eyebrow>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">Selected projects</h2>
          </div>
          <a
            href="/portfolio"
            className="inline-flex items-center gap-1 text-sm font-medium text-sky-600 dark:text-sky-400"
          >
            Portfolio <ArrowRight size={14} />
          </a>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {selectedWork.map((project) => (
            <Card key={project.slug} href={`/portfolio/projects/${project.slug}`}>
              <p className="text-xs text-zinc-500">{project.year}</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight">{project.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{project.summary}</p>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
