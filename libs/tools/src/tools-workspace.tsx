import { tools, getTool } from "./registry";
import { toolUi } from "./tool-ui";

export function ToolsWorkspace({ selectedSlug }: { selectedSlug?: string }) {
  const fallback = tools[0];
  const tool = (selectedSlug ? getTool(selectedSlug) : fallback) ?? fallback;
  const ToolUi = toolUi[tool.slug];

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
      <aside className="lg:sticky lg:top-24 lg:w-64 lg:shrink-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-600 dark:text-sky-400">
          Tools
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-950 lg:text-xl dark:text-white">
          Pick a utility
        </h1>
        <p className="mt-2 hidden text-sm leading-relaxed text-zinc-500 lg:block dark:text-zinc-400">
          Runs in your browser. Nothing is uploaded.
        </p>
        <nav
          aria-label="Developer tools"
          className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:mt-5 lg:max-h-[min(36rem,calc(100dvh-12rem))] lg:flex-col lg:gap-1 lg:overflow-y-auto lg:overflow-x-hidden lg:px-0 lg:pb-1"
        >
          {tools.map((item) => {
            const active = item.slug === tool.slug;
            return (
              <a
                key={item.slug}
                href={`/tools/${item.slug}`}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-sm font-medium transition lg:rounded-xl lg:px-3 lg:py-2.5 ${
                  active
                    ? "border-sky-400/50 bg-sky-400/15 text-sky-800 dark:border-sky-400/40 dark:bg-sky-400/10 dark:text-sky-200"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-sky-400/40 hover:bg-zinc-50 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:bg-white/5"
                }`}
              >
                <span className="block whitespace-nowrap">{item.title}</span>
                <span className="mt-0.5 hidden text-xs font-normal leading-snug text-zinc-500 lg:line-clamp-2 dark:text-zinc-400">
                  {item.description}
                </span>
              </a>
            );
          })}
        </nav>
      </aside>

      <section className="min-w-0 flex-1">
        <header className="border-b border-zinc-200 pb-5 dark:border-white/10">
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950 sm:text-3xl dark:text-white">
            {tool.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-400">
            {tool.description}
          </p>
        </header>
        <div className="mt-6">
          {ToolUi ? <ToolUi /> : <p className="text-zinc-500">This tool is not wired up yet.</p>}
        </div>
      </section>
    </div>
  );
}
