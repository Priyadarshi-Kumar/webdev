import { Card, Eyebrow } from "@webdev/components";
import type { Project } from "@webdev/types";
import { SITE } from "../site/config";
import { profile, projects } from "./data";

export function PortfolioPage() {
  return (
    <article>
      <Eyebrow>Portfolio</Eyebrow>
      <h1 className="page-title">{profile.name}</h1>
      <p className="mt-2 text-zinc-500">
        {SITE.role} · {profile.location}
      </p>
      <div className="mt-8 max-w-2xl space-y-4 text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-300">
        {profile.bio.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-bold">Stack</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {profile.stack.map((item) => (
            <li
              key={item}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm dark:border-white/10 dark:bg-zinc-900/60"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold">Experience</h2>
        <ul className="mt-6 space-y-6">
          {profile.experience.map((job) => (
            <li key={job.company}>
              <Card>
                <p className="text-sm text-zinc-500">{job.period}</p>
                <h3 className="mt-1 font-semibold">
                  {job.role} · {job.company}
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{job.detail}</p>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-bold">Projects</h2>
          <a href="/portfolio/projects" className="text-sm font-medium text-sky-600 dark:text-sky-400">
            All projects
          </a>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.slug} href={`/portfolio/projects/${project.slug}`}>
              <p className="text-xs text-zinc-500">{project.year}</p>
              <h3 className="mt-2 font-semibold">{project.title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{project.summary}</p>
            </Card>
          ))}
        </div>
      </section>
    </article>
  );
}

export function ProjectListPage() {
  return (
    <section>
      <Eyebrow>Portfolio</Eyebrow>
      <h1 className="page-title">Projects</h1>
      <p className="page-lead">Selected work. Edit the data file to replace these placeholders.</p>
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
