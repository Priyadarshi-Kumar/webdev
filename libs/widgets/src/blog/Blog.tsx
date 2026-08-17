import { CodeBlock, JsonLd, ManagerCompare, ScrollHints, Tag, Term } from "@webdev/components";
import type { PostFrontmatter } from "@webdev/types";
import { groupPostsBySubject, resolveSubject, type TocEntry } from "@webdev/utils";
import { ChevronDown, Maximize2, Minimize2, Search } from "lucide-react";
import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react";
import { SITE, getSiteUrl } from "../site/config";
import { ArticleToc } from "./ArticleToc";

type MdxComponents = {
  Term: typeof Term;
  ManagerCompare: typeof ManagerCompare;
  pre: typeof CodeBlock;
};

type NotePost = PostFrontmatter & {
  Component?: ComponentType<{ components?: MdxComponents }>;
};

const mdxComponents: MdxComponents = { Term, ManagerCompare, pre: CodeBlock };

function isGlossary(post: PostFrontmatter) {
  return post.tags?.includes("glossary") ?? false;
}

function titleMatches(post: PostFrontmatter, query: string) {
  return post.title.toLowerCase().includes(query) || post.slug.toLowerCase().includes(query);
}

function SearchField({ query, onQueryChange }: { query: string; onQueryChange: (value: string) => void }) {
  return (
    <label className="relative block">
      <span className="sr-only">Search notes and jargon</span>
      <Search
        size={16}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
        aria-hidden
      />
      <input
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search notes and jargon"
        autoComplete="off"
        className="field"
      />
    </label>
  );
}

function CollapsibleSection({
  id,
  title,
  count,
  open,
  onToggle,
  nested = false,
  children,
}: {
  id: string;
  title: string;
  count: number;
  open: boolean;
  onToggle: () => void;
  nested?: boolean;
  children: ReactNode;
}) {
  if (count === 0) return null;

  if (nested) {
    return (
      <div className="rounded-xl border border-zinc-200/70 bg-zinc-50/80 dark:border-white/10 dark:bg-zinc-900/40">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className="flex w-full items-center gap-2 px-2 py-1.5 text-left transition hover:bg-zinc-100/90 dark:hover:bg-white/5"
        >
          <ChevronDown
            size={14}
            className={`shrink-0 text-zinc-500 transition duration-200 ${open ? "rotate-180 text-sky-500" : ""}`}
            aria-hidden
          />
          <span className="min-w-0 flex-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">
            {title}
          </span>
          <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-zinc-500 dark:bg-white/10 dark:text-zinc-400">
            {count}
          </span>
        </button>
        {open ? (
          <div id={id} className="border-t border-zinc-200/70 px-1.5 py-1.5 dark:border-white/10">
            {children}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200/90 bg-white/70 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] dark:border-white/10 dark:bg-zinc-950/45 dark:shadow-[0_1px_0_rgba(255,255,255,0.05)_inset]">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-2.5 py-2.5 text-left transition hover:bg-zinc-100/80 dark:hover:bg-white/5"
      >
        <span
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-zinc-600 transition dark:text-zinc-300 ${
            open
              ? "border-sky-400/50 bg-sky-400/15 text-sky-700 dark:text-sky-300"
              : "border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-zinc-900"
          }`}
        >
          <ChevronDown size={16} className={`transition duration-200 ${open ? "rotate-180" : ""}`} aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="font-display text-sm font-semibold tracking-tight text-zinc-950 dark:text-white">
              {title}
            </span>
            <span className="rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-zinc-500 dark:bg-white/10 dark:text-zinc-400">
              {count}
            </span>
          </span>
          <span className="mt-0.5 block text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
            {open ? "Hide list" : "Show list"}
          </span>
        </span>
      </button>
      {open ? (
        <div id={id} className="space-y-2 border-t border-zinc-200/80 px-2 py-2 dark:border-white/10">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function PostList({
  posts,
  selectedSlug,
}: {
  posts: PostFrontmatter[];
  selectedSlug?: string;
}) {
  return (
    <ul className="space-y-1">
      {posts.map((post) => {
        const active = post.slug === selectedSlug;
        return (
          <li key={post.slug}>
            <a
              href={`/blog/${post.slug}`}
              aria-current={active ? "page" : undefined}
              className={`block rounded-xl px-3 py-2 text-sm font-medium leading-snug transition ${
                active
                  ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                  : "text-zinc-700 hover:bg-zinc-200/70 dark:text-zinc-300 dark:hover:bg-white/10"
              }`}
            >
              {post.title}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function SubjectLists({
  scope,
  posts,
  selectedSlug,
  openTopics,
  onToggleTopic,
}: {
  scope: string;
  posts: PostFrontmatter[];
  selectedSlug?: string;
  openTopics: Record<string, boolean>;
  onToggleTopic: (key: string) => void;
}) {
  const groups = useMemo(() => groupPostsBySubject(posts), [posts]);

  return (
    <>
      {groups.map((group) => {
        const key = `${scope}:${group.id}`;
        return (
          <CollapsibleSection
            key={group.id}
            id={`blog-topic-${scope}-${group.id}`}
            title={group.label}
            count={group.posts.length}
            nested
            open={openTopics[key] ?? false}
            onToggle={() => onToggleTopic(key)}
          >
            <PostList posts={group.posts} selectedSlug={selectedSlug} />
          </CollapsibleSection>
        );
      })}
    </>
  );
}

export function BlogWorkspace({
  posts,
  selectedSlug,
  toc = [],
}: {
  posts: NotePost[];
  selectedSlug?: string;
  toc?: TocEntry[];
}) {
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();

  const notes = useMemo(() => {
    const list = posts.filter((post) => !isGlossary(post));
    if (!needle) return list;
    return list.filter((post) => titleMatches(post, needle));
  }, [posts, needle]);

  const jargon = useMemo(() => {
    const list = posts
      .filter(isGlossary)
      .slice()
      .sort((a, b) => a.title.localeCompare(b.title));
    if (!needle) return list;
    return list.filter((post) => titleMatches(post, needle));
  }, [posts, needle]);

  const selected = selectedSlug ? posts.find((post) => post.slug === selectedSlug) : undefined;
  const selectedIsJargon = selected ? isGlossary(selected) : false;

  const [articlesOpen, setArticlesOpen] = useState(!selectedIsJargon);
  const [jargonOpen, setJargonOpen] = useState(selectedIsJargon);
  const [openTopics, setOpenTopics] = useState<Record<string, boolean>>(() => {
    if (!selected) return {};
    const scope = selectedIsJargon ? "jargon" : "articles";
    return { [`${scope}:${resolveSubject(selected.tags)}`]: true };
  });

  useEffect(() => {
    const compact = !window.matchMedia("(min-width: 1024px)").matches;
    if (!selectedSlug) {
      setArticlesOpen(true);
      setJargonOpen(false);
      return;
    }
    if (compact) {
      setArticlesOpen(false);
      setJargonOpen(false);
      return;
    }
    if (selectedIsJargon) setJargonOpen(true);
    else setArticlesOpen(true);
  }, [selectedSlug, selectedIsJargon]);

  useEffect(() => {
    if (!selected) return;
    const scope = selectedIsJargon ? "jargon" : "articles";
    const key = `${scope}:${resolveSubject(selected.tags)}`;
    setOpenTopics((current) => (current[key] ? current : { ...current, [key]: true }));
  }, [selected, selectedIsJargon]);

  useEffect(() => {
    if (!needle) return;
    if (notes.length > 0) setArticlesOpen(true);
    if (jargon.length > 0) setJargonOpen(true);
    setOpenTopics((current) => {
      const next = { ...current };
      for (const group of groupPostsBySubject(notes)) next[`articles:${group.id}`] = true;
      for (const group of groupPostsBySubject(jargon)) next[`jargon:${group.id}`] = true;
      return next;
    });
  }, [needle, notes, jargon]);

  const Content = selected?.Component;
  const empty = notes.length === 0 && jargon.length === 0;
  const [zen, setZen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("zen-mode", zen);
    return () => document.documentElement.classList.remove("zen-mode");
  }, [zen]);

  useEffect(() => {
    if (!zen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setZen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zen]);

  return (
    <div
      className={`blog-workspace flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8 ${
        toc.length > 0
          ? "lg:pr-36 lg:w-[calc(100%+max(0px,calc((100vw-72rem)/2-16rem)))]"
          : "lg:w-[calc(100%+max(0px,calc((100vw-72rem)/2-2rem)))]"
      }`}
    >
      <aside className="blog-rail relative z-20 lg:sticky lg:top-0 lg:-ml-6 lg:flex lg:h-[calc(100svh-14rem)] lg:max-h-[calc(100svh-14rem)] lg:w-64 lg:shrink-0 lg:flex-col lg:overflow-hidden lg:self-start">
        <SearchField query={query} onQueryChange={setQuery} />
        <ScrollHints
          frameClassName="mt-4 min-h-0 lg:flex-1"
          className="rail-scroll min-h-0 space-y-3 lg:h-full lg:overflow-y-auto"
        >
          <nav aria-label="Notes and jargon">
            {empty ? (
              <p className="px-1 text-sm text-zinc-500 dark:text-zinc-400">
                Nothing matches “{query.trim()}”. Try another title or jargon word.
              </p>
            ) : null}
            <div className="space-y-3">
              <CollapsibleSection
                id="blog-articles"
                title="Articles"
                count={notes.length}
                open={articlesOpen}
                onToggle={() => setArticlesOpen((open) => !open)}
              >
                <SubjectLists
                  scope="articles"
                  posts={notes}
                  selectedSlug={selectedSlug}
                  openTopics={openTopics}
                  onToggleTopic={(key) => setOpenTopics((current) => ({ ...current, [key]: !current[key] }))}
                />
              </CollapsibleSection>
              <CollapsibleSection
                id="blog-jargon"
                title="Jargon"
                count={jargon.length}
                open={jargonOpen}
                onToggle={() => setJargonOpen((open) => !open)}
              >
                <SubjectLists
                  scope="jargon"
                  posts={jargon}
                  selectedSlug={selectedSlug}
                  openTopics={openTopics}
                  onToggleTopic={(key) => setOpenTopics((current) => ({ ...current, [key]: !current[key] }))}
                />
              </CollapsibleSection>
            </div>
          </nav>
        </ScrollHints>
      </aside>

      {selected && Content ? (
        <>
          <article className="blog-article card min-w-0 flex-1 p-5 sm:p-7">
            <JsonLd
              data={{
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                headline: selected.title,
                description: selected.description,
                datePublished: selected.date,
                author: { "@type": "Person", name: SITE.name, url: getSiteUrl() },
                url: `${getSiteUrl()}/blog/${selected.slug}`,
              }}
            />
            <p className="text-xs text-zinc-500">{selected.date}</p>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl dark:text-white">
              {selected.title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-400">
              {selected.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {selected.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
            <div className="prose-article">
              <Content components={mdxComponents} />
            </div>
          </article>
          <ArticleToc items={toc} />
        </>
      ) : (
        <div className="card min-w-0 flex-1 p-5 sm:p-7">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">Notes</h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-400">
            Pick an article or a jargon term. Each one has its own URL, so Back and Forward move between them.
          </p>
        </div>
      )}
      {selected && Content ? (
        <button
          type="button"
          onClick={() => setZen((open) => !open)}
          aria-pressed={zen}
          className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-1.5 rounded-full border-2 border-sky-400 bg-white/90 px-3 py-2 text-xs font-medium text-zinc-700 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.45)] backdrop-blur-md transition hover:border-sky-300 hover:text-sky-700 dark:border-sky-400 dark:bg-zinc-950/80 dark:text-zinc-200 dark:hover:border-sky-300 dark:hover:text-sky-300"
        >
          {zen ? <Minimize2 size={14} aria-hidden /> : <Maximize2 size={14} aria-hidden />}
          {zen ? "Exit zen" : "Zen"}
        </button>
      ) : null}
    </div>
  );
}

export function BlogIndex({
  posts,
  selectedSlug,
  toc,
}: {
  posts: NotePost[];
  selectedSlug?: string;
  toc?: TocEntry[];
}) {
  const firstNoteSlug = posts.find((post) => !isGlossary(post))?.slug;
  return <BlogWorkspace posts={posts} selectedSlug={selectedSlug ?? firstNoteSlug} toc={toc} />;
}

export function BlogPost({
  posts,
  selectedSlug,
  toc,
}: {
  posts: NotePost[];
  selectedSlug: string;
  toc?: TocEntry[];
}) {
  return <BlogWorkspace posts={posts} selectedSlug={selectedSlug} toc={toc} />;
}
