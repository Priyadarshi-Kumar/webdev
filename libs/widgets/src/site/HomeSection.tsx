import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@webdev/components";

export function HomeSectionHeader({
  eyebrow,
  title,
  href,
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3 sm:mb-5">
      <div className="min-w-0">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="section-title text-xl sm:text-3xl">{title}</h2>
      </div>
      {href && linkLabel ? (
        <a
          href={href}
          className="inline-flex shrink-0 min-h-10 items-center gap-1 rounded-full border border-zinc-200/80 bg-white/60 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:border-sky-400/50 hover:text-sky-700 sm:text-sm dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:text-sky-300"
        >
          {linkLabel}
          <ArrowRight size={14} aria-hidden />
        </a>
      ) : null}
    </div>
  );
}
