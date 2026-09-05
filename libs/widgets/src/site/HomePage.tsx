import { ArrowRight, Mail } from "lucide-react";
import { Card, Eyebrow, JsonLd, Tag } from "@webdev/components";
import type { PostFrontmatter } from "@webdev/types";
import { profile, projects } from "../portfolio/data";
import { SITE, getSiteUrl } from "./config";
import { SkillSphere } from "./SkillSphere";
import { ContactCta } from "./ContactCta";
import { ExperienceSpotlight } from "./ExperienceSpotlight";
import { HomeSectionHeader } from "./HomeSection";
import { WritingSpotlight } from "./WritingSpotlight";

export function HomePage({
  posts,
  notesCount,
}: {
  posts: PostFrontmatter[];
  notesCount: number;
}) {
  const featuredWork = projects.slice(0, 3);
  const currentRole = profile.experience[0];
  const stats = [
    { label: "Years in product", value: "7" },
    { label: "Tenant scale", value: "10×" },
    { label: "Browser journeys", value: "35K+" },
  ];

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

      <section className="relative grid items-stretch gap-6 pb-6 pt-2 sm:gap-8 sm:pb-12 sm:pt-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-8">
        <div className="max-w-2xl">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            <span className="font-medium text-emerald-700 dark:text-emerald-300">{profile.availability}</span>
            <span className="mx-2 text-zinc-300 dark:text-zinc-600">·</span>
            Bangalore / remote
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-zinc-950 sm:mt-5 sm:text-6xl dark:text-white">
            Priyadarshi
            <span className="text-gradient"> Kumar</span>
          </h1>
          <p className="mt-4 text-lg font-medium tracking-tight text-zinc-800 sm:text-xl dark:text-zinc-100">
            Lead full-stack engineer. I ship React and Python products that move the numbers.
          </p>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-400">
            Tekion · Setu · Yulu · Maieutic. Dashboards, fintech onboarding, mobility, EDA tooling.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={`mailto:${SITE.email}`} className="btn-primary inline-flex w-full items-center justify-center gap-2 sm:w-auto">
              <Mail size={16} aria-hidden />
              Email me
            </a>
            <a href="/portfolio/experience" className="btn-ghost w-full sm:w-auto">
              View resume
            </a>
            <a href={SITE.socials.linkedin} className="btn-ghost w-full sm:w-auto">
              LinkedIn
            </a>
          </div>
          <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-zinc-200/80 pt-5 dark:border-white/10">
            {stats.map((item) => (
              <div key={item.label}>
                <dt className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                  {item.label}
                </dt>
                <dd className="mt-1 font-display text-xl font-semibold tracking-tight text-zinc-950 sm:text-2xl dark:text-white">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="flex min-h-[16rem] w-full items-center justify-center sm:min-h-[20rem] lg:min-h-[24rem]">
          <SkillSphere skills={[...profile.stack, ...profile.skillGroups.flatMap((group) => group.skills)]} />
        </div>
      </section>

      <div className="grid gap-6 py-4 sm:gap-8 sm:py-6 lg:grid-cols-2 lg:items-stretch">
        {currentRole ? (
          <section className="flex min-w-0 flex-col">
            <HomeSectionHeader
              eyebrow="Now"
              title="Current seat"
              href="/portfolio/experience"
              linkLabel="Resume"
            />
            <ExperienceSpotlight role={currentRole} maxHighlights={2} />
          </section>
        ) : null}

        <section className="flex min-w-0 flex-col">
          <HomeSectionHeader
            eyebrow="Writing"
            title={`${notesCount} notes`}
            href="/blog"
            linkLabel="All notes"
          />
          <WritingSpotlight posts={posts} compact />
        </section>
      </div>

      {featuredWork.length > 0 ? (
        <section className="py-4 sm:py-6">
          <div className="mb-3 flex items-end justify-between gap-3 sm:mb-5">
            <div>
              <Eyebrow>Work</Eyebrow>
              <h2 className="section-title text-xl sm:text-3xl">Selected projects</h2>
            </div>
            <a
              href="/portfolio/projects"
              className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 sm:text-sm dark:text-sky-400"
            >
              All <ArrowRight size={14} />
            </a>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {featuredWork.map((project) => (
              <Card key={project.slug} href={project.href ?? `/portfolio/projects/${project.slug}`} className="p-3.5 sm:p-5">
                <p className="text-[11px] text-zinc-500 sm:text-xs">{project.year}</p>
                <h3 className="mt-1 text-sm font-semibold tracking-tight sm:mt-2 sm:text-lg">{project.title}</h3>
                <p className="mt-1 hidden text-sm leading-relaxed text-zinc-600 sm:mt-2 sm:line-clamp-2 sm:block dark:text-zinc-400">
                  {project.summary}
                </p>
                <div className="mt-2 hidden flex-wrap gap-1.5 sm:mt-3 sm:flex">
                  {project.tags.slice(0, 3).map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      <ContactCta />
    </>
  );
}
