import { Github, Linkedin, Mail, Phone } from "lucide-react";
import { Card, Eyebrow } from "@webdev/components";
import type { Project } from "@webdev/types";
import { SITE } from "../site/config";
import { profile, projects } from "./data";

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-400">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function PortfolioPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <header className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-sky-400/10 via-white to-violet-400/10 px-5 py-8 sm:px-8 sm:py-10 dark:border-white/10 dark:from-sky-400/10 dark:via-zinc-950 dark:to-violet-400/10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-400">
          {profile.availability}
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-5xl dark:text-white">
          {profile.name}
        </h1>
        <p className="mt-2 text-lg font-medium text-zinc-700 dark:text-zinc-200">{profile.headline}</p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{profile.location}</p>
        <div className="mt-5 space-y-3 text-[0.95rem] leading-relaxed text-zinc-600 dark:text-zinc-300">
          {profile.bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <ul className="mt-6 flex flex-wrap gap-2">
          <li>
            <a
              href={`tel:${profile.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1.5 text-sm text-zinc-700 transition hover:border-sky-400 hover:text-sky-700 dark:border-white/10 dark:bg-zinc-900/70 dark:text-zinc-200 dark:hover:text-sky-300"
            >
              <Phone size={14} aria-hidden />
              {profile.phone}
            </a>
          </li>
          <li>
            <a
              href={`mailto:${SITE.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1.5 text-sm text-zinc-700 transition hover:border-sky-400 hover:text-sky-700 dark:border-white/10 dark:bg-zinc-900/70 dark:text-zinc-200 dark:hover:text-sky-300"
            >
              <Mail size={14} aria-hidden />
              Email
            </a>
          </li>
          <li>
            <a
              href={SITE.socials.linkedin}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1.5 text-sm text-zinc-700 transition hover:border-sky-400 hover:text-sky-700 dark:border-white/10 dark:bg-zinc-900/70 dark:text-zinc-200 dark:hover:text-sky-300"
            >
              <Linkedin size={14} aria-hidden />
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href={SITE.socials.github}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1.5 text-sm text-zinc-700 transition hover:border-sky-400 hover:text-sky-700 dark:border-white/10 dark:bg-zinc-900/70 dark:text-zinc-200 dark:hover:text-sky-300"
            >
              <Github size={14} aria-hidden />
              GitHub
            </a>
          </li>
        </ul>
      </header>

      <ResumeSection title="Experience">
        <ol className="relative space-y-0 border-l border-zinc-200 pl-6 dark:border-white/15">
          {profile.experience.map((job) => (
            <li key={`${job.company}-${job.period}`} className="relative pb-10 last:pb-0">
              <span
                aria-hidden
                className="absolute -left-[1.54rem] top-1.5 h-3 w-3 rounded-full border-2 border-sky-400 bg-zinc-50 dark:bg-zinc-950"
              />
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="text-lg font-bold tracking-tight text-zinc-950 dark:text-white">{job.company}</h3>
                <p className="text-sm tabular-nums text-zinc-500 dark:text-zinc-400">{job.period}</p>
              </div>
              <p className="mt-1 text-sm font-medium text-sky-700 dark:text-sky-300">
                {job.role} · {job.location}
              </p>
              <ul className="mt-3 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {job.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </ResumeSection>

      <ResumeSection title="Technical Skills">
        <div className="grid gap-4 sm:grid-cols-2">
          {profile.technicalSkills.map((group) => (
            <div
              key={group.label}
              className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-900/50"
            >
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{group.label}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:border-white/10 dark:bg-zinc-950/60 dark:text-zinc-300"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ResumeSection>

      <ResumeSection title="Education">
        <ul className="space-y-3">
          {profile.education.map((item) => (
            <li
              key={item.school}
              className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 dark:border-white/10 dark:bg-zinc-900/50"
            >
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
        <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Open-source work and experiments outside my day job.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.slug} href={project.href ?? `/portfolio/projects/${project.slug}`}>
              <p className="text-xs text-zinc-500">{project.year}</p>
              <h3 className="mt-2 font-semibold tracking-tight">{project.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{project.summary}</p>
            </Card>
          ))}
        </div>
        <a
          href="/portfolio/projects"
          className="mt-5 inline-flex text-sm font-medium text-sky-600 hover:underline dark:text-sky-400"
        >
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
