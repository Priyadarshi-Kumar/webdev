import type { ReactNode } from "react";
import { Card, Eyebrow } from "@webdev/components";
import type { Project } from "@webdev/types";
import { SITE } from "../site/config";
import { profile, projects } from "./data";

function ResumeSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10 border-t border-zinc-200 pt-8 first:mt-0 first:border-t-0 first:pt-0 dark:border-white/10">
      <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-zinc-950 dark:text-white">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function ContactLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="text-zinc-600 transition hover:text-sky-600 dark:text-zinc-300 dark:hover:text-sky-400">
      {children}
    </a>
  );
}

export function PortfolioPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <header className="border-b border-zinc-200 pb-8 dark:border-white/10">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
          {profile.name}
        </h1>
        <p className="mt-2 text-base font-medium text-zinc-600 dark:text-zinc-300">{profile.headline}</p>
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
          <li>
            <ContactLink href={`tel:${profile.phone.replace(/\s/g, "")}`}>{profile.phone}</ContactLink>
          </li>
          <li aria-hidden className="text-zinc-300 dark:text-zinc-600">
            ·
          </li>
          <li>
            <ContactLink href={`mailto:${SITE.email}`}>{SITE.email}</ContactLink>
          </li>
          <li aria-hidden className="text-zinc-300 dark:text-zinc-600">
            ·
          </li>
          <li>
            <ContactLink href={SITE.socials.linkedin}>linkedin.com/in/priyadarshikumar</ContactLink>
          </li>
          <li aria-hidden className="text-zinc-300 dark:text-zinc-600">
            ·
          </li>
          <li>
            <ContactLink href={SITE.socials.github}>github.com/Priyadarshi-Kumar</ContactLink>
          </li>
        </ul>
      </header>

      <ResumeSection title="Experience">
        <ul className="space-y-8">
          {profile.experience.map((job) => (
            <li key={`${job.company}-${job.period}`}>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">{job.company}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{job.period}</p>
              </div>
              <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {job.role} · {job.location}
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {job.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </ResumeSection>

      <ResumeSection title="Technical Skills">
        <div className="space-y-4">
          {profile.technicalSkills.map((group) => (
            <div key={group.label}>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{group.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {group.skills.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </ResumeSection>

      <ResumeSection title="Education">
        <ul className="space-y-4">
          {profile.education.map((item) => (
            <li key={item.school}>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">{item.school}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{item.period}</p>
              </div>
              <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                {item.degree} · {item.location}
              </p>
            </li>
          ))}
        </ul>
      </ResumeSection>

      <ResumeSection title="Side projects">
        <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
          Open-source work and experiments outside my day job.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.slug} href={project.href ?? `/portfolio/projects/${project.slug}`}>
              <p className="text-xs text-zinc-500">{project.year}</p>
              <h3 className="mt-2 font-semibold">{project.title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{project.summary}</p>
            </Card>
          ))}
        </div>
        <a href="/portfolio/projects" className="mt-4 inline-block text-sm font-medium text-sky-600 dark:text-sky-400">
          View all projects →
        </a>
      </ResumeSection>
    </article>
  );
}

export function ProjectListPage() {
  return (
    <section>
      <Eyebrow>Portfolio</Eyebrow>
      <h1 className="page-title">Projects</h1>
      <p className="page-lead">Selected work — shipped apps, experiments, and the platform you are browsing now.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.slug} href={`/portfolio/projects/${project.slug}`}>
            <p className="text-xs text-zinc-500">{project.year}</p>
            <h3 className="mt-2 text-lg font-semibold">{project.title}</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{project.summary}</p>
            <p className="mt-3 text-xs text-zinc-500">{project.tags.join(" · ")}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function ProjectPage({ project }: { project: Project }) {
  return (
    <article>
      <Eyebrow>{project.year}</Eyebrow>
      <h1 className="page-title">{project.title}</h1>
      <p className="page-lead">{project.summary}</p>
      <p className="mt-4 text-sm text-zinc-500">
        {project.role} · {project.tags.join(" · ")}
      </p>
      {project.href ? (
        <a href={project.href} className="btn-primary mt-8">
          Visit
        </a>
      ) : null}
      <p className="mt-10 max-w-2xl text-zinc-600 dark:text-zinc-400">
        Expand this page with process, screenshots, and outcomes when you are ready. The route is already
        prerendered.
      </p>
    </article>
  );
}
