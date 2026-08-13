import { Card, Eyebrow, JsonLd, ManagerCompare, Tag, Term } from "@webdev/components";
import type { PostFrontmatter } from "@webdev/types";
import type { TocEntry } from "@webdev/utils";
import { Search } from "lucide-react";
import { useMemo, useState, type ComponentType } from "react";
import { SITE, getSiteUrl } from "../site/config";
import { ArticleToc } from "./ArticleToc";

function titleMatches(post: PostFrontmatter, query: string) {
  return post.title.toLowerCase().includes(query);
}

export function BlogIndex({ posts }: { posts: PostFrontmatter[] }) {
  const [query, setQuery] = useState("");
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

  const empty = notes.length === 0 && glossary.length === 0;

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
      {notes.length > 0 ? (
        <ul className="mt-10 space-y-4">
          {notes.map((post) => (
            <li key={post.slug}>
              <Card href={`/blog/${post.slug}`}>
                <p className="text-xs text-zinc-500">{post.date}</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight">{post.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{post.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      ) : null}
      {glossary.length > 0 ? (
        <div className={notes.length > 0 ? "mt-16" : "mt-10"}>
          <Eyebrow>Glossary</Eyebrow>
          <h2 className="page-title">Short notes on the jargon</h2>
          <p className="page-lead">Each hover term in the articles has a full page with a small code example.</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {glossary.map((post) => (
              <li key={post.slug}>
                <Card href={`/blog/${post.slug}`}>
                  <h3 className="text-base font-semibold tracking-tight">{post.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{post.description}</p>
                </Card>
              </li>
            ))}
          </ul>
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
