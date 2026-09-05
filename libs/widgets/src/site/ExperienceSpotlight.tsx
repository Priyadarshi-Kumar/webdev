import { ArrowRight, Briefcase, MapPin } from "lucide-react";
import type { Experience } from "@webdev/types";

export function ExperienceSpotlight({
  role,
  href = "/portfolio/experience",
  maxHighlights = 3,
}: {
  role: Experience;
  href?: string;
  maxHighlights?: number;
}) {
  return (
    <article className="home-spotlight home-spotlight-experience flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="home-spotlight-badge inline-flex items-center gap-1.5">
          <Briefcase size={13} aria-hidden />
          Current role
        </span>
        <time className="text-xs font-medium tabular-nums text-zinc-500 dark:text-zinc-400">{role.period}</time>
      </div>

      <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-zinc-950 sm:text-2xl dark:text-white">
        {role.company}
      </h3>
      <p className="mt-1 text-sm font-medium text-sky-700 dark:text-sky-300">{role.role}</p>
      <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
        <MapPin size={13} aria-hidden />
        {role.location}
      </p>

      <ul className="mt-5 flex-1 space-y-3 border-t border-zinc-200/80 pt-5 dark:border-white/10">
        {role.highlights.slice(0, maxHighlights).map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500 dark:bg-sky-400" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <a
        href={href}
        className="home-spotlight-link mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200/90 bg-white/60 px-4 py-2.5 text-sm font-semibold text-zinc-800 transition hover:border-sky-400/60 hover:text-sky-700 sm:w-auto sm:justify-start dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:hover:text-sky-300"
      >
        Full experience
        <ArrowRight size={15} aria-hidden />
      </a>
    </article>
  );
}
