import { ArrowRight, Mail } from "lucide-react";
import { Card, Eyebrow, JsonLd, Tag } from "@webdev/components";
import type { PostFrontmatter, ToolMeta } from "@webdev/types";
import { profile, projects } from "../portfolio/data";
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
  const featuredWork = projects.slice(0, 3);
  const currentRole = profile.experience[0];

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
              email: SITE.email,
              address: { "@type": "PostalAddress", addressCountry: "IN" },
              sameAs: [SITE.socials.github, SITE.socials.linkedin],
            },
          ],
        }}
      />

      <section className="relative overflow-hidden pb-10 pt-2 sm:pb-16 sm:pt-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl dark:bg-sky-400/10" />
        <div className="pointer-events-none absolute -left-16 top-32 h-48 w-48 rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-400/5" />
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
            {profile.availability}
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">{profile.location}</span>
        </div>
        <h1 className="mt-5 max-w-4xl text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-6xl dark:text-white">
          {SITE.name}
        </h1>
        <p className="mt-3 max-w-2xl text-lg font-medium text-sky-700 sm:text-xl dark:text-sky-300">
          {profile.headline}
        </p>
        <p className="page-lead mt-4 max-w-3xl">{SITE.tagline}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={`mailto:${SITE.email}`} className="btn-primary inline-flex items-center gap-2">
            <Mail size={16} aria-hidden />
            Email me
          </a>
          <a href={SITE.socials.linkedin} className="btn-ghost">
            LinkedIn
          </a>
          <a href="/portfolio" className="btn-ghost">
            View portfolio
          </a>
        </div>
      </section>

      <section className="grid gap-3 border-t border-zinc-200 py-10 sm:grid-cols-2 lg:grid-cols-4 dark:border-white/10">
        {[
          { label: "Experience", value: "6+ yrs" },
          { label: "Public repos", value: "38+" },
          { label: "Technical articles", value: String(notesCount) },
          { label: "Core stack", value: "React & TS" },
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
        <Eyebrow>Why hire me</Eyebrow>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">What you get on day one</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {profile.highlights.map((item) => (
            <li
              key={item}
              className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-sm leading-relaxed text-zinc-600 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-300"
            >
              {item.replace("{notesCount}", String(notesCount))}
            </li>
          ))}
        </ul>
      </section>

      <section className="py-8">
        <Eyebrow>Skills</Eyebrow>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">Stack I ship with</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {profile.skillGroups.map((group) => (
            <div
              key={group.label}
              className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-zinc-900/50"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {group.label}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm dark:border-white/10 dark:bg-zinc-950/60"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {currentRole ? (
        <section className="py-8">
          <Eyebrow>Experience</Eyebrow>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">Recent focus</h2>
          <Card className="mt-6 block">
            <p className="text-xs text-zinc-500">{currentRole.period}</p>
            <h3 className="mt-2 text-lg font-semibold tracking-tight">
              {currentRole.role} · {currentRole.company}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {currentRole.highlights[0]}
            </p>
          </Card>
          <a
            href="/portfolio"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-sky-600 dark:text-sky-400"
          >
            Full résumé <ArrowRight size={14} />
          </a>
        </section>
      ) : null}

      <section className="py-8">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <Eyebrow>Proof of work</Eyebrow>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">Selected projects</h2>
          </div>
          <a
            href="/portfolio/projects"
            className="inline-flex items-center gap-1 text-sm font-medium text-sky-600 dark:text-sky-400"
          >
            All projects <ArrowRight size={14} />
          </a>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featuredWork.map((project) => (
            <Card key={project.slug} href={project.href ?? `/portfolio/projects/${project.slug}`}>
              <p className="text-xs text-zinc-500">{project.year}</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight">{project.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{project.summary}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.tags.slice(0, 4).map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-8">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <Eyebrow>Writing</Eyebrow>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">Technical depth</h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
              I explain hard topics clearly — the same skill I bring to code reviews and team docs.
            </p>
          </div>
          <a href="/blog" className="inline-flex items-center gap-1 text-sm font-medium text-sky-600 dark:text-sky-400">
            All articles <ArrowRight size={14} />
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

      {tools.length > 0 ? (
        <section className="py-8">
          <Eyebrow>Built tools</Eyebrow>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">Shipped utilities</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {tools.map((tool) => (
              <Card key={tool.slug} href={`/tools/${tool.slug}`}>
                <h3 className="text-lg font-semibold tracking-tight">{tool.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{tool.description}</p>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-4 rounded-3xl border border-sky-400/20 bg-gradient-to-br from-sky-400/10 via-transparent to-violet-400/10 px-6 py-10 sm:px-10">
        <Eyebrow>Let&apos;s talk</Eyebrow>
        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Ready to add a React engineer who ships?</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-300">
          I am looking for teams that value clear code, fast iteration, and engineers who document what they build. Send a
          note — I reply within a day.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={`mailto:${SITE.email}`} className="btn-primary inline-flex items-center gap-2">
            <Mail size={16} aria-hidden />
            {SITE.email}
          </a>
          <a href={SITE.socials.linkedin} className="btn-ghost">
            Connect on LinkedIn
          </a>
          <a href={SITE.socials.github} className="btn-ghost">
            GitHub
          </a>
        </div>
      </section>
    </>
  );
}
