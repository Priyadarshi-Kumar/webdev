import { ScrollHints } from "@webdev/components";
import { Search, Wrench } from "lucide-react";
import { useMemo, useState } from "react";
import { tools, getTool, toolGroups } from "./registry";
import { toolIcons } from "./tool-icons";
import { toolUi } from "./tool-ui";

export function ToolsWorkspace({ selectedSlug }: { selectedSlug?: string }) {
  const fallback = tools[0];
  const tool = (selectedSlug ? getTool(selectedSlug) : fallback) ?? fallback;
  const ToolUi = toolUi[tool.slug];
  const Icon = toolIcons[tool.slug] ?? Wrench;
  const groupLabel = toolGroups.find((group) => group.id === tool.group)?.label ?? tool.group;

  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();

  const visible = useMemo(() => {
    if (!needle) return tools;
    return tools.filter(
      (item) =>
        item.title.toLowerCase().includes(needle) ||
        item.description.toLowerCase().includes(needle) ||
        item.slug.includes(needle),
    );
  }, [needle]);

  return (
    <div className="flex min-h-full flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
      <aside className="sticky top-0 z-20 -mx-4 flex flex-col bg-slate-50/90 px-4 py-2 backdrop-blur-md dark:bg-[#07080c]/90 lg:top-0 lg:mx-0 lg:h-[calc(100svh-14rem)] lg:max-h-[calc(100svh-14rem)] lg:w-64 lg:shrink-0 lg:self-start lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
          <label className="relative block">
            <span className="sr-only">Search tools</span>
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tools"
              autoComplete="off"
              className="field"
            />
          </label>

          <ScrollHints
            frameClassName="mt-3 min-h-0 lg:mt-4 lg:flex-1 lg:min-h-0"
            className="rail-scroll h-full min-h-0 overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden lg:overscroll-contain"
          >
            <nav aria-label="Developer tools" className="flex w-max gap-1 lg:w-full lg:flex-col">
              {visible.length === 0 ? (
                <p className="px-1 py-2 text-sm text-zinc-500 dark:text-zinc-400">
                  Nothing matches “{query.trim()}”.
                </p>
              ) : (
                toolGroups.map((group) => {
                  const items = visible.filter((item) => item.group === group.id);
                  if (items.length === 0) return null;
                  return (
                    <div key={group.id} className="shrink-0 lg:mb-3">
                    <p className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-600 lg:text-[11px] dark:text-sky-400">
                      {group.label}
                    </p>
                      <div className="flex gap-1 lg:flex-col lg:gap-0.5">
                        {items.map((item) => {
                          const active = item.slug === tool.slug;
                          const ItemIcon = toolIcons[item.slug] ?? Wrench;
                          return (
                            <a
                              key={item.slug}
                              href={`/tools/${item.slug}`}
                              aria-current={active ? "page" : undefined}
                              className={`relative flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-2.5 py-2 text-[13px] font-medium transition lg:w-full ${
                                active
                                  ? "bg-zinc-950 text-white shadow-sm dark:bg-white dark:text-zinc-950"
                                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/8 dark:hover:text-white"
                              }`}
                            >
                              <ItemIcon size={15} className="hidden shrink-0 opacity-80 lg:block" aria-hidden />
                              <span className="truncate">{item.title}</span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </nav>
          </ScrollHints>
        </aside>

        <section className="card min-w-0 flex-1 p-5 sm:p-7">
          <header className="border-b border-zinc-200/80 pb-5 dark:border-white/10">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-sky-400/30 bg-sky-400/10 text-sky-700 dark:text-sky-300">
                <Icon size={20} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">
                  {groupLabel}
                </p>
                <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl dark:text-white">
                  {tool.title}
                </h2>
              </div>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-400">
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
