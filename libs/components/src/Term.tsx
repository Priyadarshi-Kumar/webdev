import { useId, type ReactNode } from "react";
import { glossary, type GlossaryId } from "./glossary";

export function Term({ id, children }: { id: GlossaryId; children: ReactNode }) {
  const uid = useId();
  const entry = glossary[id];
  const href = `/blog/${entry.slug}`;

  return (
    <span className="group/term relative inline">
      <a
        href={href}
        aria-describedby={uid}
        className="inline cursor-help border-b border-dotted border-sky-500/80 font-[inherit] font-medium text-sky-800 no-underline hover:text-sky-600 dark:text-sky-300 dark:hover:text-sky-200"
      >
        {children}
      </a>
      <span
        id={uid}
        role="tooltip"
        className="pointer-events-none invisible absolute left-1/2 top-full z-30 mt-1.5 hidden w-72 max-w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-zinc-200 bg-white p-3 text-left text-sm font-normal leading-relaxed text-zinc-600 opacity-0 shadow-lg shadow-zinc-950/10 transition duration-150 before:absolute before:-top-2 before:left-0 before:h-2 before:w-full group-hover/term:pointer-events-auto group-hover/term:visible group-hover/term:opacity-100 group-focus-within/term:pointer-events-auto group-focus-within/term:visible group-focus-within/term:opacity-100 lg:block dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300 dark:shadow-black/40"
      >
        <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">
          In plain words
        </span>
        {entry.explain}
        <a
          href={href}
          className="mt-3 flex min-h-11 items-center font-medium text-sky-600 no-underline hover:underline dark:text-sky-400"
        >
          Full page →
        </a>
      </span>
    </span>
  );
}
