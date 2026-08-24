import { useState, type ReactNode } from "react";
import {
  Briefcase,
  Download,
  FolderKanban,
  Globe,
  GraduationCap,
  Linkedin,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Card, Eyebrow } from "@webdev/components";
import type { Project } from "@webdev/types";
import { SITE } from "../site/config";
import { profile, projects } from "./data";
import { downloadResume } from "./resume-download";
import { SkillsGrid } from "../site/SkillsGrid";

export const portfolioSections = [
  { id: "about", label: "About", href: "/portfolio/about", icon: UserRound },
  { id: "experience", label: "Experience", href: "/portfolio/experience", icon: Briefcase },
  { id: "skills", label: "Skills", href: "/portfolio/skills", icon: Sparkles },
  { id: "education", label: "Education", href: "/portfolio/education", icon: GraduationCap },
  { id: "projects", label: "Projects", href: "/portfolio/projects", icon: FolderKanban },
] as const;

export type PortfolioSectionId = (typeof portfolioSections)[number]["id"];

const sectionIds: readonly string[] = portfolioSections.map((item) => item.id);

export function isPortfolioSection(value: string): value is PortfolioSectionId {
  return sectionIds.includes(value);
}

function ResumeDownloadButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={downloadResume} className={`btn-resume ${className ?? ""}`.trim()}>
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-zinc-800 dark:text-zinc-100">
        <Download size={15} strokeWidth={2.25} aria-hidden />
      </span>
      <span className="min-w-0 text-left">
        <span className="block leading-tight">Download resume</span>
        <span className="mt-0.5 block font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
          PDF
        </span>
      </span>
    </button>
  );
}

function AboutPhoto() {
  const [failed, setFailed] = useState(false);
  const src = profile.photo;
  const showImage = Boolean(src) && !failed;

  return (
    <div className="relative mx-auto w-44 shrink-0 sm:mx-0 sm:w-52 lg:w-56">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-2 rounded-full bg-sky-400/25 blur-3xl dark:bg-sky-400/20"
      />
      <div className="relative aspect-square overflow-hidden rounded-full border border-zinc-200/80 shadow-[0_12px_32px_-18px_rgba(15,23,42,0.45)] dark:border-white/10">
        {showImage ? (
          <img
            src={src}
            alt={profile.name}
            className="h-full w-full object-cover object-[center_22%]"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-zinc-100 text-zinc-400 dark:bg-zinc-950/50 dark:text-zinc-500">
            <UserRound size={44} strokeWidth={1.4} aria-hidden />
            <span className="text-xs font-medium">Add photo</span>
          </div>
        )}
      </div>
    </div>
  );
}

const nameLinks = [
  { href: SITE.url, label: "Portfolio", Icon: Globe },
  { href: SITE.socials.linkedin, label: "LinkedIn", Icon: Linkedin },
] as const;

function AboutPanel() {
  return (
    <div className="relative flex flex-col items-center gap-7 overflow-visible sm:flex-row-reverse sm:items-center sm:justify-between sm:gap-10">
      <AboutPhoto />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-zinc-950 sm:text-5xl dark:text-white">
            {profile.name}
          </h1>
          <ul className="flex items-center gap-2.5">
            {nameLinks.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="inline-flex h-7 w-7 items-center justify-center text-zinc-800 transition hover:text-sky-600 dark:text-zinc-100 dark:hover:text-sky-300"
                  aria-label={item.label}
                  rel="noreferrer"
                  target="_blank"
                >
                  <item.Icon size={14} fill="currentColor" strokeWidth={0} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-2 text-lg font-medium text-zinc-700 dark:text-zinc-200">{profile.headline}</p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          <a href={`tel:+91${profile.phone}`} className="transition hover:text-sky-600 dark:hover:text-sky-300">
            {profile.phone}
          </a>
          <span aria-hidden> · </span>
          <a href={`mailto:${SITE.email}`} className="transition hover:text-sky-600 dark:hover:text-sky-300">
            {SITE.email}
          </a>
        </p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{profile.location}</p>
      </div>
    </div>
  );
}

function ExperiencePanel() {
  return (
    <ol className="relative space-y-0 border-l border-zinc-200 pl-6 dark:border-white/15">
      {profile.experience.map((job) => (
        <li key={`${job.company}-${job.period}`} className="relative pb-10 last:pb-0">
          <span
            aria-hidden
            className="absolute -left-[1.54rem] top-1.5 h-3 w-3 rounded-full border-2 border-sky-400 bg-slate-50 dark:bg-[#07080c]"
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
  );
}

function SkillsPanel() {
  return <SkillsGrid groups={profile.technicalSkills} />;
}

function EducationPanel() {
  return (
    <ul className="space-y-3">
      {profile.education.map((item) => (
        <li key={item.school} className="rounded-2xl border border-zinc-200/80 bg-white/50 px-5 py-4 dark:border-white/10 dark:bg-zinc-950/40">
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
  );
}

function ProjectsPanel() {
  if (projects.length === 0) {
    return <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">No projects yet.</p>;
  }

  return (
    <>
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
    </>
  );
}

const panels: Record<PortfolioSectionId, { title: string; body: () => ReactNode }> = {
  about: { title: "About", body: () => <AboutPanel /> },
  experience: { title: "Experience", body: () => <ExperiencePanel /> },
  skills: { title: "Skills", body: () => <SkillsPanel /> },
  education: { title: "Education", body: () => <EducationPanel /> },
  projects: { title: "Projects", body: () => <ProjectsPanel /> },
};

export function PortfolioPage({ section }: { section: PortfolioSectionId }) {
  const active = panels[section];

  return (
    <div className="flex min-h-full min-w-0 flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
      <aside className="sticky top-0 z-20 -mx-3 min-w-0 bg-slate-50/90 px-3 py-2 pr-14 backdrop-blur-md dark:bg-[#07080c]/90 sm:-mx-0 sm:px-0 sm:pr-0 lg:top-10 lg:w-56 lg:shrink-0 lg:self-start lg:bg-transparent lg:px-0 lg:py-0 lg:pr-0 lg:backdrop-blur-none">
        <p className="eyebrow hidden lg:block">Portfolio</p>
        <h1 className="section-title hidden text-2xl lg:mt-1 lg:block lg:text-xl">Resume</h1>
        <nav
          aria-label="Portfolio sections"
          className="mt-3 flex gap-1 overflow-x-auto rounded-2xl border border-zinc-200/80 bg-white/70 p-1.5 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)] backdrop-blur-xl lg:mt-6 lg:flex-col lg:gap-1 lg:overflow-visible lg:p-2 dark:border-white/10 dark:bg-zinc-950/55"
        >
          {portfolioSections.map((item, index) => {
            const selected = item.id === section;
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                href={item.href}
                aria-current={selected ? "page" : undefined}
                className={`group relative flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  selected
                    ? "bg-zinc-950 text-white shadow-[0_8px_20px_-12px_rgba(15,23,42,0.8)] dark:bg-gradient-to-r dark:from-sky-400 dark:to-cyan-300 dark:text-zinc-950"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/8 dark:hover:text-white"
                }`}
              >
                {selected ? (
                  <span className="absolute left-1 top-1/2 hidden h-5 w-0.5 -translate-y-1/2 rounded-full bg-sky-400 lg:block dark:bg-zinc-950/70" />
                ) : null}
                <Icon size={16} strokeWidth={selected ? 2.25 : 1.75} className="shrink-0 opacity-90" aria-hidden />
                <span>{item.label}</span>
                <span
                  className={`ml-auto hidden font-mono text-[10px] tabular-nums lg:inline ${
                    selected ? "text-white/70 dark:text-zinc-950/55" : "text-zinc-400 dark:text-zinc-600"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </a>
            );
          })}
        </nav>
        <ResumeDownloadButton className="mt-3 hidden w-full lg:inline-flex" />
      </aside>

      <section className="card min-w-0 flex-1 p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl dark:text-white">
            {active.title}
          </h2>
          <ResumeDownloadButton className="lg:hidden" />
        </div>
        <div className="mt-6">{active.body()}</div>
      </section>
    </div>
  );
}

export function ProjectListPage() {
  return (
    <section>
      <Eyebrow>Portfolio</Eyebrow>
      <h1 className="page-title">Projects</h1>
      {projects.length === 0 ? (
        <p className="page-lead">No projects yet.</p>
      ) : (
        <>
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
        </>
      )}
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
