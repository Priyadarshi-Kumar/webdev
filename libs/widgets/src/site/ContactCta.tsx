import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { Eyebrow } from "@webdev/components";
import { SITE } from "./config";

export function ContactCta() {
  return (
    <section className="contact-cta relative mt-4 overflow-hidden rounded-3xl border border-sky-400/20 sm:mt-8">
      <div className="contact-cta-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative grid gap-8 px-5 py-8 sm:px-10 sm:py-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-10">
        <div className="min-w-0">
          <Eyebrow>Let&apos;s talk</Eyebrow>
          <h2 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-4xl dark:text-white">
            Building something that has to <span className="text-gradient">ship</span>?
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-300">
            I take features from design to release. Reply usually within a day.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
            Open to full-time &amp; contract · Bangalore / remote
          </p>
        </div>

        <div className="flex w-full min-w-0 flex-col gap-3 sm:gap-3.5">
          <a
            href={`mailto:${SITE.email}`}
            className="contact-cta-primary group flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-left sm:min-h-[3.25rem] sm:px-5"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-950/10 text-zinc-950 dark:bg-white/15 dark:text-white">
                <Mail size={18} aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-zinc-950 dark:text-white">Email me</span>
                <span className="block truncate text-xs text-zinc-600 dark:text-zinc-300">{SITE.email}</span>
              </span>
            </span>
            <ArrowUpRight
              size={18}
              className="shrink-0 text-zinc-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sky-600 dark:group-hover:text-sky-300"
              aria-hidden
            />
          </a>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <a
              href={SITE.socials.linkedin}
              className="contact-cta-secondary flex min-h-12 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold"
            >
              <Linkedin size={17} aria-hidden />
              LinkedIn
            </a>
            <a
              href={SITE.socials.github}
              className="contact-cta-secondary flex min-h-12 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold"
            >
              <Github size={17} aria-hidden />
              GitHub
            </a>
          </div>
          <a
            href="/portfolio/experience"
            className="text-center text-sm font-medium text-sky-700 underline-offset-4 hover:underline dark:text-sky-300"
          >
            View full resume →
          </a>
        </div>
      </div>
    </section>
  );
}
