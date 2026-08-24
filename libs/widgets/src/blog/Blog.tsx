import { CodeBlock, JsonLd, ManagerCompare, ScrollHints, Tag, Term } from "@webdev/components";
import { resolveLastArticleSlug, writeLastArticle } from "@webdev/store";
import type { PostFrontmatter } from "@webdev/types";
import {
  groupPostsBySubject,
  resolvePostSubject,
  subjectLabel,
  type BlogSubjectId,
  type TocEntry,
} from "@webdev/utils";
import { ArrowRight, BookOpen, ExternalLink, Maximize2, Minimize2, Newspaper, Search, Tags } from "lucide-react";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import { SITE, getSiteUrl } from "../site/config";
import { ArticleToc } from "./ArticleToc";
import { EXTERNAL_ARTICLES, type ExternalArticle } from "./external-articles";

type MdxComponents = {
  Term: typeof Term;
  ManagerCompare: typeof ManagerCompare;
  pre: typeof CodeBlock;
};

type NotePost = PostFrontmatter & {
  Component?: ComponentType<{ components?: MdxComponents }>;
};

type BlogPane = "articles" | "jargon" | "external" | "article";

const mdxComponents: MdxComponents = { Term, ManagerCompare, pre: CodeBlock };

function isGlossary(post: PostFrontmatter) {
  return post.tags?.includes("glossary") ?? false;
}

function titleMatches(post: PostFrontmatter, query: string) {
  const haystack = `${post.title} ${post.slug} ${post.description ?? ""}`.toLowerCase();
  return haystack.includes(query);
}

function SearchField({ query, onQueryChange }: { query: string; onQueryChange: (value: string) => void }) {
  return (
    <label className="relative block">
      <span className="sr-only">Search notes, jargon, and links</span>
      <Search
        size={16}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
        aria-hidden
      />
      <input
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search by title or topic"
        autoComplete="off"
        className="field"
      />
    </label>
  );
}

function ModeNav({
  pane,
  readingKind,
  articleCounts,
  layout = "stack",
}: {
  pane: BlogPane;
  readingKind?: "articles" | "jargon";
  articleCounts: { articles: number; jargon: number; external: number };
  layout?: "stack" | "pills";
}) {
  const modes = [
    { id: "articles" as const, href: "/blog", label: "Articles", count: articleCounts.articles, Icon: BookOpen },
    { id: "jargon" as const, href: "/blog/jargon", label: "Jargon", count: articleCounts.jargon, Icon: Tags },
    {
      id: "external" as const,
      href: "/blog/external",
      label: "External",
      count: articleCounts.external,
      Icon: Newspaper,
    },
  ];

  if (layout === "pills") {
    return (
      <nav
        aria-label="Blog sections"
        className="flex gap-1 overflow-x-auto rounded-2xl border border-zinc-200/80 bg-white/70 p-1 [-ms-overflow-style:none] [scrollbar-width:none] dark:border-white/10 dark:bg-zinc-950/55 [&::-webkit-scrollbar]:hidden"
      >
        {modes.map((mode) => {
          const selected = pane === mode.id || (pane === "article" && readingKind === mode.id);
          const Icon = mode.Icon;
          return (
            <a
              key={mode.id}
              href={mode.href}
              aria-current={selected ? "page" : undefined}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition ${
                selected
                  ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/8 dark:hover:text-white"
              }`}
            >
              <Icon size={14} className="shrink-0 opacity-90" aria-hidden />
              {mode.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                  selected
                    ? "bg-white/20 text-white dark:bg-zinc-950/15 dark:text-zinc-950"
                    : "bg-zinc-100 text-zinc-500 dark:bg-white/10 dark:text-zinc-400"
                }`}
              >
                {mode.count}
              </span>
            </a>
          );
        })}
      </nav>
    );
  }

  return (
    <nav aria-label="Blog sections" className="space-y-1">
      {modes.map((mode) => {
        const selected = pane === mode.id || (pane === "article" && readingKind === mode.id);
        const Icon = mode.Icon;
        return (
          <a
            key={mode.id}
            href={mode.href}
            aria-current={selected ? "page" : undefined}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              selected
                ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/8 dark:hover:text-white"
            }`}
          >
            <Icon size={15} className="shrink-0 opacity-90" aria-hidden />
            <span className="min-w-0 flex-1">{mode.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                selected
                  ? "bg-white/20 text-white dark:bg-zinc-950/15 dark:text-zinc-950"
                  : "bg-zinc-100 text-zinc-500 dark:bg-white/10 dark:text-zinc-400"
              }`}
            >
              {mode.count}
            </span>
          </a>
        );
      })}
    </nav>
  );
}

function TopicChips({
  subjects,
  active,
  onChange,
  total,
}: {
  subjects: { id: BlogSubjectId; label: string; count: number }[];
  active: BlogSubjectId | "all";
  onChange: (id: BlogSubjectId | "all") => void;
  total: number;
}) {
  if (subjects.length <= 1) return null;

  const chips: { id: BlogSubjectId | "all"; label: string; count: number }[] = [
    { id: "all", label: "All", count: total },
    ...subjects,
  ];

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
      {chips.map((chip) => {
        const selected = active === chip.id;
        return (
          <button
            key={chip.id}
            type="button"
            onClick={() => onChange(chip.id)}
            aria-pressed={selected}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              selected
                ? "border-sky-400/70 bg-sky-400/15 text-sky-800 dark:text-sky-200"
                : "border-zinc-200/90 bg-white/70 text-zinc-600 hover:border-sky-400/50 hover:text-sky-700 dark:border-white/10 dark:bg-zinc-950/40 dark:text-zinc-300 dark:hover:text-sky-300"
            }`}
          >
            {chip.label}
            <span className="tabular-nums opacity-70">{chip.count}</span>
          </button>
        );
      })}
    </div>
  );
}

function PostCards({
  posts,
  emptyQuery,
}: {
  posts: PostFrontmatter[];
  emptyQuery: string;
}) {
  if (posts.length === 0) {
    return (
      <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
        {emptyQuery
          ? `Nothing matches “${emptyQuery}”. Try another word or clear the topic filter.`
          : "No notes in this topic yet."}
      </p>
    );
  }

  return (
    <ul className="mt-6 grid gap-4 sm:grid-cols-2">
      {posts.map((post) => (
        <li key={post.slug}>
          <a href={`/blog/${post.slug}`} className="card group flex h-full flex-col p-4 sm:p-5">
            <span className="flex items-center justify-between gap-3">
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-sky-700 dark:text-sky-300">
                {subjectLabel(resolvePostSubject(post))}
              </span>
              <time className="text-[11px] tabular-nums text-zinc-500 dark:text-zinc-400">{post.date}</time>
            </span>
            <span className="mt-2 block text-base font-semibold tracking-tight text-zinc-950 transition group-hover:text-sky-700 dark:text-white dark:group-hover:text-sky-300">
              {post.title}
            </span>
            <span className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {post.description}
            </span>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-sky-700 dark:text-sky-300">
              Read
              <ArrowRight size={13} aria-hidden />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function BrowsePanel({
  title,
  lead,
  posts,
  subjectFilter,
  onSubjectFilter,
  query,
  continueSlug,
  continueTitle,
}: {
  title: string;
  lead: string;
  posts: PostFrontmatter[];
  subjectFilter: BlogSubjectId | "all";
  onSubjectFilter: (id: BlogSubjectId | "all") => void;
  query: string;
  continueSlug?: string;
  continueTitle?: string;
}) {
  const groups = useMemo(() => groupPostsBySubject(posts), [posts]);
  const subjects = groups.map((group) => ({
    id: group.id,
    label: group.label,
    count: group.posts.length,
  }));
  const visible =
    subjectFilter === "all" ? posts : (groups.find((group) => group.id === subjectFilter)?.posts ?? []);

  return (
    <div className="min-w-0 flex-1">
      <h1 className="font-display text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-400">{lead}</p>

      {continueSlug && continueTitle ? (
        <a
          href={`/blog/${continueSlug}`}
          className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-sky-400/30 bg-sky-400/10 px-4 py-3 transition hover:border-sky-400/50"
        >
          <span className="min-w-0">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-300">
              Continue reading
            </span>
            <span className="mt-0.5 block truncate text-sm font-semibold text-zinc-950 dark:text-white">
              {continueTitle}
            </span>
          </span>
          <ArrowRight size={16} className="shrink-0 text-sky-600 dark:text-sky-300" aria-hidden />
        </a>
      ) : null}

      <div className="mt-5">
        <TopicChips
          subjects={subjects}
          active={subjectFilter}
          onChange={onSubjectFilter}
          total={posts.length}
        />
      </div>
      <PostCards posts={visible} emptyQuery={query.trim()} />
    </div>
  );
}

function ExternalArticlesPanel({ articles, query }: { articles: ExternalArticle[]; query: string }) {
  return (
    <div className="min-w-0 flex-1">
      <h1 className="font-display text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
        External articles
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-base dark:text-zinc-400">
        Web development writing from elsewhere. Each link opens in a new tab.
      </p>
      {articles.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
          Nothing matches “{query.trim()}”. Try another title or source.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {articles.map((article) => (
            <li key={article.href}>
              <a
                href={article.href}
                target="_blank"
                rel="noreferrer"
                className="card group flex h-full flex-col p-4 sm:p-5"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                    {article.source}
                  </span>
                  <ExternalLink
                    size={15}
                    className="shrink-0 text-zinc-400 transition group-hover:text-sky-600 dark:group-hover:text-sky-300"
                    aria-hidden
                  />
                </span>
                <span className="mt-2 block text-base font-semibold tracking-tight text-zinc-950 transition group-hover:text-sky-700 dark:text-white dark:group-hover:text-sky-300">
                  {article.title}
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {article.description}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function RelatedList({
  posts,
  selectedSlug,
  subjectId,
}: {
  posts: PostFrontmatter[];
  selectedSlug: string;
  subjectId: BlogSubjectId;
}) {
  const related = posts.filter((post) => post.slug !== selectedSlug).slice(0, 8);
  if (related.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
        More in {subjectLabel(subjectId)}
      </p>
      <ul className="mt-2 space-y-1">
        {related.map((post) => (
          <li key={post.slug}>
            <a
              href={`/blog/${post.slug}`}
              className="block rounded-xl px-3 py-2 text-sm font-medium leading-snug text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/8 dark:hover:text-white"
            >
              {post.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BlogWorkspace({
  posts,
  selectedSlug,
  toc = [],
  pane = "articles",
}: {
  posts: NotePost[];
  selectedSlug?: string;
  toc?: TocEntry[];
  pane?: BlogPane;
}) {
  const [query, setQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<BlogSubjectId | "all">("all");
  const [continueReading, setContinueReading] = useState<{ slug: string; title: string } | null>(null);
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

  const external = useMemo(() => {
    if (!needle) return EXTERNAL_ARTICLES;
    return EXTERNAL_ARTICLES.filter(
      (article) =>
        article.title.toLowerCase().includes(needle) ||
        article.source.toLowerCase().includes(needle) ||
        article.description.toLowerCase().includes(needle),
    );
  }, [needle]);

  const isReadingPane = pane === "article";
  const selected = isReadingPane && selectedSlug ? posts.find((post) => post.slug === selectedSlug) : undefined;
  const selectedSubject = selected ? resolvePostSubject(selected) : undefined;
  const relatedPool = selected
    ? (isGlossary(selected) ? jargon : notes).filter((post) => resolvePostSubject(post) === selectedSubject)
    : [];

  useEffect(() => {
    setSubjectFilter("all");
  }, [pane, needle]);

  useEffect(() => {
    if (pane !== "articles") return;
    const lastSlug = resolveLastArticleSlug(posts.map((post) => post.slug));
    if (!lastSlug) return;
    const post = posts.find((item) => item.slug === lastSlug);
    if (post) setContinueReading({ slug: post.slug, title: post.title });
  }, [pane, posts]);

  const Content = selected?.Component;
  const [zen, setZen] = useState(false);

  useEffect(() => {
    if (!selected) return;
    writeLastArticle({
      slug: selected.slug,
      title: selected.title,
      readAt: new Date().toISOString(),
    });
  }, [selected?.slug, selected?.title]);

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

  const browseWide = pane === "articles" || pane === "jargon" || pane === "external";
  const reading = Boolean(selected && Content);
  const readingKind = selected ? (isGlossary(selected) ? "jargon" : "articles") : undefined;
  const modeCounts = {
    articles: posts.filter((post) => !isGlossary(post)).length,
    jargon: posts.filter(isGlossary).length,
    external: EXTERNAL_ARTICLES.length,
  };
  const browseHref = selected && isGlossary(selected) ? "/blog/jargon" : "/blog";
  const browseLabel = selected && isGlossary(selected) ? "jargon" : "articles";

  return (
    <div
      className={`blog-workspace flex min-w-0 flex-col gap-6 lg:flex-row lg:items-start lg:gap-8 ${
        browseWide
          ? ""
          : toc.length > 0
            ? "lg:pr-36 lg:w-[calc(100%+max(0px,calc((100vw-72rem)/2-16rem)))]"
            : "lg:w-[calc(100%+max(0px,calc((100vw-72rem)/2-2rem)))]"
      }`}
    >
      {reading ? (
        <>
          <div className="sticky top-0 z-20 -mx-3 border-b border-zinc-200/80 bg-slate-50/95 px-3 py-2 pr-14 backdrop-blur-md lg:hidden dark:border-white/10 dark:bg-[#07080c]/95">
            <a
              href={browseHref}
              className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-zinc-700 transition hover:text-sky-700 dark:text-zinc-200 dark:hover:text-sky-300"
            >
              ← Back to {browseLabel}
            </a>
          </div>
          <aside className="blog-rail sticky top-0 z-20 hidden lg:-ml-6 lg:flex lg:h-[calc(100svh-14rem)] lg:max-h-[calc(100svh-14rem)] lg:w-56 lg:shrink-0 lg:flex-col lg:overflow-hidden lg:self-start">
            <SearchField query={query} onQueryChange={setQuery} />
            <ScrollHints
              frameClassName="mt-4 min-h-0 lg:flex-1"
              className="rail-scroll min-h-0 space-y-4 lg:h-full lg:overflow-y-auto"
            >
              <ModeNav pane={pane} readingKind={readingKind} articleCounts={modeCounts} />
              {selectedSubject ? (
                <>
                  <a
                    href={browseHref}
                    className="block rounded-xl border border-zinc-200/80 px-3 py-2 text-xs font-semibold text-zinc-600 transition hover:border-sky-400/50 hover:text-sky-700 dark:border-white/10 dark:text-zinc-300 dark:hover:text-sky-300"
                  >
                    ← Back to {browseLabel}
                  </a>
                  <RelatedList posts={relatedPool} selectedSlug={selected!.slug} subjectId={selectedSubject} />
                </>
              ) : null}
            </ScrollHints>
          </aside>
        </>
      ) : (
        <aside className="blog-rail sticky top-0 z-20 -mx-3 space-y-3 bg-slate-50/90 px-3 py-2 pr-14 backdrop-blur-md dark:bg-[#07080c]/90 sm:-mx-0 sm:px-0 sm:pr-0 lg:-ml-6 lg:flex lg:h-[calc(100svh-14rem)] lg:max-h-[calc(100svh-14rem)] lg:w-56 lg:shrink-0 lg:flex-col lg:space-y-0 lg:overflow-hidden lg:self-start lg:bg-transparent lg:px-0 lg:py-0 lg:pr-0 lg:backdrop-blur-none">
          <SearchField query={query} onQueryChange={setQuery} />
          <div className="lg:mt-4 lg:hidden">
            <ModeNav pane={pane} readingKind={readingKind} articleCounts={modeCounts} layout="pills" />
          </div>
          <ScrollHints
            frameClassName="hidden min-h-0 lg:mt-4 lg:flex lg:flex-1"
            className="rail-scroll min-h-0 space-y-4 lg:h-full lg:overflow-y-auto"
          >
            <ModeNav pane={pane} readingKind={readingKind} articleCounts={modeCounts} />
          </ScrollHints>
        </aside>
      )}

      {pane === "external" ? (
        <ExternalArticlesPanel articles={external} query={query} />
      ) : pane === "articles" ? (
        <BrowsePanel
          title="Articles"
          lead="Longer notes — pick a topic chip or search, then open a card."
          posts={notes}
          subjectFilter={subjectFilter}
          onSubjectFilter={setSubjectFilter}
          query={query}
          continueSlug={continueReading?.slug}
          continueTitle={continueReading?.title}
        />
      ) : pane === "jargon" ? (
        <BrowsePanel
          title="Jargon"
          lead="Short glossary pages. Filter by topic or search a word."
          posts={jargon}
          subjectFilter={subjectFilter}
          onSubjectFilter={setSubjectFilter}
          query={query}
        />
      ) : selected && Content ? (
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
            <p className="text-xs text-zinc-500">
              <span className="text-sky-700 dark:text-sky-300">{subjectLabel(resolvePostSubject(selected))}</span>
              <span aria-hidden> · </span>
              {selected.date}
            </p>
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
          <h1 className="font-display text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            Not found
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            That note is missing.{" "}
            <a href="/blog" className="font-medium text-sky-700 dark:text-sky-300">
              Browse articles
            </a>
            .
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

export function BlogIndex({ posts }: { posts: NotePost[] }) {
  return <BlogWorkspace posts={posts} pane="articles" />;
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
  return <BlogWorkspace posts={posts} selectedSlug={selectedSlug} toc={toc} pane="article" />;
}
