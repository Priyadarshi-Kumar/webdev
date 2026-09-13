import { BookOpen, Briefcase, FileText, Hash, Search, Sparkles, Wrench } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { SearchEntry, SearchKind } from "@webdev/types";

const kindOrder: SearchKind[] = ["page", "note", "jargon", "practice", "tool", "portfolio"];

const kindLabel: Record<SearchKind, string> = {
  page: "Pages",
  note: "Notes",
  jargon: "Jargon",
  practice: "Practice",
  tool: "Tools",
  portfolio: "Portfolio",
};

const kindIcon = {
  page: FileText,
  note: BookOpen,
  jargon: Hash,
  practice: Sparkles,
  tool: Wrench,
  portfolio: Briefcase,
} as const;

type SearchApi = {
  open: () => void;
};

const SearchContext = createContext<SearchApi | null>(null);

export function useSiteSearch() {
  const value = useContext(SearchContext);
  if (!value) {
    throw new Error("useSiteSearch must be used inside SiteSearch");
  }
  return value;
}

function normalize(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/\p{M}/gu, "");
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest("input, textarea, select, [contenteditable=true]"));
}

function scoreEntry(entry: SearchEntry, query: string) {
  const q = normalize(query.trim());
  if (!q) return 0;

  const title = normalize(entry.title);
  const description = normalize(entry.description);
  const keywords = normalize((entry.keywords ?? []).join(" "));
  const hay = `${title} ${description} ${keywords} ${normalize(entry.href)}`;
  const tokens = q.split(/\s+/).filter(Boolean);
  if (!tokens.every((token) => hay.includes(token))) return -1;

  let score = 0;
  if (title === q) score += 120;
  else if (title.startsWith(q)) score += 90;
  else if (title.includes(q)) score += 55;
  if (description.includes(q)) score += 12;
  for (const token of tokens) {
    if (title.includes(token)) score += 8;
    else if (keywords.includes(token)) score += 5;
    else if (description.includes(token)) score += 3;
  }
  return score;
}

function rankEntries(entries: SearchEntry[], query: string) {
  const trimmed = query.trim();
  if (!trimmed) {
    return entries.filter((entry) => entry.kind === "page");
  }

  return entries
    .map((entry) => ({ entry, score: scoreEntry(entry, trimmed) }))
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score || kindOrder.indexOf(a.entry.kind) - kindOrder.indexOf(b.entry.kind))
    .slice(0, 40)
    .map((item) => item.entry);
}

function groupEntries(entries: SearchEntry[]) {
  const groups: { kind: SearchKind; items: SearchEntry[] }[] = [];
  for (const kind of kindOrder) {
    const items = entries.filter((entry) => entry.kind === kind);
    if (items.length) groups.push({ kind, items });
  }
  return groups;
}

export function SiteSearch({ entries, children }: { entries: SearchEntry[]; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openSearch = useCallback(() => setOpen(true), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if ((event.metaKey || event.ctrlKey) && key === "k") {
        event.preventDefault();
        setOpen((value) => !value);
        return;
      }
      if (key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey && !isTypingTarget(event.target)) {
        event.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <SearchContext.Provider value={{ open: openSearch }}>
      {children}
      {open ? <SearchDialog entries={entries} onClose={() => setOpen(false)} /> : null}
    </SearchContext.Provider>
  );
}

export function SearchTrigger({
  className,
  showShortcut = false,
  children,
  onOpen,
}: {
  className?: string;
  showShortcut?: boolean;
  children?: ReactNode;
  onOpen?: () => void;
}) {
  const { open } = useSiteSearch();
  return (
    <button
      type="button"
      onClick={() => {
        onOpen?.();
        open();
      }}
      className={className}
    >
      {children ?? (
        <>
          <Search size={16} aria-hidden />
          <span className="sr-only">Search the site</span>
          {showShortcut ? (
            <kbd className="hidden rounded-md border border-zinc-200/80 px-1.5 py-0.5 font-mono text-[10px] font-medium text-zinc-500 sm:inline dark:border-white/10 dark:text-zinc-400">
              ⌘K
            </kbd>
          ) : null}
        </>
      )}
    </button>
  );
}

function SearchDialog({ entries, onClose }: { entries: SearchEntry[]; onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const matches = useMemo(() => rankEntries(entries, query), [entries, query]);
  const groups = useMemo(() => groupEntries(matches), [matches]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    const node = listRef.current?.querySelector<HTMLElement>(`[data-search-index="${active}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }, [active]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const move = (delta: number) => {
    if (!matches.length) return;
    setActive((value) => (value + delta + matches.length) % matches.length);
  };

  return (
    <div className="fixed inset-0 z-[80]" role="presentation">
      <button
        type="button"
        aria-label="Close search"
        className="absolute inset-0 bg-zinc-950/55 backdrop-blur-[3px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute left-1/2 top-[max(1rem,env(safe-area-inset-top))] w-[min(40rem,calc(100vw-1.5rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/95 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.55)] backdrop-blur-xl sm:top-[12vh] dark:border-white/10 dark:bg-zinc-950/95"
      >
        <h2 id={titleId} className="sr-only">
          Search the site
        </h2>
        <label className="relative block border-b border-zinc-200/80 dark:border-white/10">
          <span className="sr-only">Search notes, practice, tools, and portfolio</span>
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
            aria-hidden
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                move(1);
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                move(-1);
              } else if (event.key === "Enter") {
                const href = matches[active]?.href;
                if (href) {
                  event.preventDefault();
                  onClose();
                  window.location.assign(href);
                }
              }
            }}
            placeholder="Search notes, jargon, practice, tools…"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="w-full bg-transparent py-3.5 pl-11 pr-4 text-base text-zinc-900 outline-none placeholder:text-zinc-400 sm:text-sm dark:text-zinc-100 dark:placeholder:text-zinc-500"
          />
        </label>
        <div ref={listRef} className="max-h-[min(28rem,62vh)] overflow-y-auto p-2">
          {matches.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
              Nothing matches “{query.trim()}”.
            </p>
          ) : (
            groups.map((group) => {
              const Icon = kindIcon[group.kind];
              return (
                <section key={group.kind} className="mb-1.5 last:mb-0">
                  <p className="flex items-center gap-1.5 px-2.5 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
                    <Icon size={12} aria-hidden />
                    {kindLabel[group.kind]}
                  </p>
                  <ul className="flex flex-col gap-0.5">
                    {group.items.map((entry) => {
                      const index = matches.indexOf(entry);
                      const selected = index === active;
                      return (
                        <li key={entry.id}>
                          <a
                            href={entry.href}
                            data-search-index={index}
                            onClick={onClose}
                            onMouseEnter={() => setActive(index)}
                            className={`block rounded-xl px-3 py-2.5 transition ${
                              selected
                                ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                                : "text-zinc-800 hover:bg-zinc-100/80 dark:text-zinc-100 dark:hover:bg-white/5"
                            }`}
                          >
                            <span className="block truncate text-sm font-medium">{entry.title}</span>
                            <span
                              className={`mt-0.5 line-clamp-2 text-xs ${
                                selected ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-500 dark:text-zinc-400"
                              }`}
                            >
                              {entry.description}
                            </span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })
          )}
        </div>
        <p className="hidden border-t border-zinc-200/80 px-3 py-2 text-[11px] text-zinc-500 sm:block dark:border-white/10 dark:text-zinc-500">
          ↑↓ to move · Enter to open · Esc to close
        </p>
      </div>
    </div>
  );
}
