import { Card, Eyebrow, JsonLd, ManagerCompare, Tag, Term } from "@webdev/components";
import type { PostFrontmatter } from "@webdev/types";
import { groupPostsBySubject, paginate, type BlogSubjectGroup, type TocEntry } from "@webdev/utils";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react";
import { SITE, getSiteUrl } from "../site/config";
import { ArticleToc } from "./ArticleToc";

const GLOSSARY_PAGE_SIZE = 12;
const GLOSSARY_PAGE_PARAM = "glossary";

function titleMatches(post: PostFrontmatter, query: string) {
  return post.title.toLowerCase().includes(query);
}

function readGlossaryPage() {
  if (typeof window === "undefined") return 1;
  const value = new URL(window.location.href).searchParams.get(GLOSSARY_PAGE_PARAM);
  const page = Number(value);
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

function writeGlossaryPage(page: number) {
  const url = new URL(window.location.href);
  if (page <= 1) url.searchParams.delete(GLOSSARY_PAGE_PARAM);
  else url.searchParams.set(GLOSSARY_PAGE_PARAM, String(page));
  window.history.replaceState(window.history.state, "", url);
}

function SubjectGroups({
  groups,
  listClassName,
  renderPost,
}: {
  groups: BlogSubjectGroup[];
  listClassName?: string;
  renderPost: (post: PostFrontmatter) => ReactNode;
}) {
  return (
    <>
      {groups.map((group) => (
        <section key={group.id} className="mt-10 first:mt-0">
          <Eyebrow>{group.label}</Eyebrow>
          <ul className={listClassName ?? "mt-4 space-y-4"}>{group.posts.map((post) => renderPost(post))}</ul>
        </section>
      ))}
    </>
  );
}

function GlossaryPagination({
  page,
  totalPages,
  total,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav
      className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-6 dark:border-white/10"
      aria-label="Glossary pages"
    >
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Page {page} of {totalPages} · {total} terms
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="btn-ghost inline-flex items-center gap-1 px-3 py-2 text-sm disabled:opacity-40"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={16} aria-hidden />
          Previous
        </button>
        <button
          type="button"
          className="btn-ghost inline-flex items-center gap-1 px-3 py-2 text-sm disabled:opacity-40"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight size={16} aria-hidden />
        </button>
      </div>
    </nav>
  );
}

export function BlogIndex({ posts }: { posts: PostFrontmatter[] }) {
  const [query, setQuery] = useState("");
  const [glossaryPage, setGlossaryPage] = useState(readGlossaryPage);
  const needle = query.trim().toLowerCase();

  const notes = useMemo(() => {
    const list = posts.filter((post) => !post.tags?.includes("glossary"));
    if (!needle) return list;
    return list.filter((post) => titleMatches(post, needle));
  }, [posts, needle]);

  const glossary = useMemo(() => {
    const list = posts
      .filter((post) => post.tags?.includes("glossary"))
      .slice()
      .sort((a, b) => a.title.localeCompare(b.title));
    if (!needle) return list;
    return list.filter((post) => titleMatches(post, needle) || post.slug.toLowerCase().includes(needle));
  }, [posts, needle]);

  const noteGroups = useMemo(() => groupPostsBySubject(notes), [notes]);

  const glossaryPagination = useMemo(
    () => paginate(glossary, glossaryPage, GLOSSARY_PAGE_SIZE),
    [glossary, glossaryPage],
  );

  const glossaryGroups = useMemo(
    () => groupPostsBySubject(glossaryPagination.items),
    [glossaryPagination.items],
  );

  useEffect(() => {
    if (glossaryPage > glossaryPagination.totalPages) {
      setGlossaryPage(glossaryPagination.totalPages);
      writeGlossaryPage(glossaryPagination.totalPages);
    }
  }, [glossaryPage, glossaryPagination.totalPages]);

  useEffect(() => {
    setGlossaryPage(1);
    writeGlossaryPage(1);
  }, [needle]);

  const empty = notes.length === 0 && glossary.length === 0;

  function changeGlossaryPage(page: number) {
    setGlossaryPage(page);
    writeGlossaryPage(page);
  }

  return (
    <section>
      <h1 className="page-title">Blog</h1>
      <label className="relative mt-8 block">
        <span className="sr-only">Search notes and glossary</span>
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search notes and jargon by title"
          autoComplete="off"
          className="w-full rounded-full border border-zinc-200 bg-white py-3 pl-10 pr-4 text-base text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-sky-400 sm:py-2.5 sm:text-sm dark:border-white/10 dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-sky-400/70"
        />
      </label>
      {empty ? (
        <p className="mt-10 text-sm text-zinc-500 dark:text-zinc-400">
          Nothing matches “{query.trim()}”. Try another title or jargon word.
        </p>
      ) : null}
      {noteGroups.length > 0 ? (
        <div className="mt-10">
          <Eyebrow>Notes</Eyebrow>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">Articles by subject</h2>
          <div className="mt-6 space-y-10">
            <SubjectGroups
              groups={noteGroups}
              renderPost={(post) => (
                <li key={post.slug}>
                  <Card href={`/blog/${post.slug}`}>
                    <p className="text-xs text-zinc-500">{post.date}</p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight">{post.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{post.description}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                  </Card>
                </li>
              )}
            />
          </div>
        </div>
      ) : null}
      {glossary.length > 0 ? (
        <div className={noteGroups.length > 0 ? "mt-16" : "mt-10"}>
          <Eyebrow>Glossary</Eyebrow>
          <h2 className="page-title">Short notes on the jargon</h2>
          <p className="page-lead">Each hover term in the articles has a full page with a small code example.</p>
          <div className="mt-8 space-y-10">
            <SubjectGroups
              groups={glossaryGroups}
              listClassName="mt-4 grid gap-3 sm:grid-cols-2"
              renderPost={(post) => (
                <li key={post.slug}>
                  <Card href={`/blog/${post.slug}`}>
                    <h3 className="text-base font-semibold tracking-tight">{post.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{post.description}</p>
                  </Card>
                </li>
              )}
            />
          </div>
          <GlossaryPagination
            page={glossaryPagination.page}
            totalPages={glossaryPagination.totalPages}
            total={glossaryPagination.total}
            onPageChange={changeGlossaryPage}
          />
        </div>
      ) : null}
    </section>
  );
}

export function BlogPost({
  post,
  Content,
}: {
  post: PostFrontmatter & { toc?: TocEntry[] };
  Content: ComponentType<{ components?: { Term: typeof Term; ManagerCompare: typeof ManagerCompare } }>;
}) {
  const toc = post.toc ?? [];

  return (
    <>
      <article className="mx-auto min-w-0 max-w-3xl">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            author: { "@type": "Person", name: SITE.name, url: getSiteUrl() },
            url: `${getSiteUrl()}/blog/${post.slug}`,
          }}
        />
        <a href="/blog" className="text-sm font-medium text-sky-600 dark:text-sky-400">
          ← All notes
        </a>
        <div className="mt-6">
          <Eyebrow>{post.date}</Eyebrow>
        </div>
        <h1 className="page-title">{post.title}</h1>
        <p className="page-lead">{post.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <div className="prose-article">
          <Content components={{ Term, ManagerCompare }} />
        </div>
      </article>
      <ArticleToc items={toc} />
    </>
  );
}
