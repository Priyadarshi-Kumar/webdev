import { ArrowRight, ArrowUpRight, BookOpen } from "lucide-react";
import type { PostFrontmatter } from "@webdev/types";
import { Tag } from "@webdev/components";

export function WritingSpotlight({
  posts,
  href = "/blog",
}: {
  posts: PostFrontmatter[];
  href?: string;
}) {
  if (posts.length === 0) return null;

  const [featured, ...rest] = posts;

  return (
    <div className="home-spotlight home-spotlight-writing flex h-full flex-col">
      {featured ? (
        <a href={`/blog/${featured.slug}`} className="home-writing-featured group block rounded-2xl border border-sky-400/25 bg-gradient-to-br from-sky-400/10 via-transparent to-violet-400/10 p-4 transition hover:border-sky-400/45 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <span className="home-spotlight-badge inline-flex items-center gap-1.5">
              <BookOpen size={13} aria-hidden />
              Latest article
            </span>
            <ArrowUpRight
              size={16}
              className="shrink-0 text-zinc-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sky-600 dark:group-hover:text-sky-300"
              aria-hidden
            />
          </div>
          <time className="mt-3 block text-xs text-zinc-500 dark:text-zinc-400">{featured.date}</time>
          <h3 className="mt-1 font-display text-lg font-semibold leading-snug tracking-tight text-zinc-950 group-hover:text-sky-800 sm:text-xl dark:text-white dark:group-hover:text-sky-200">
            {featured.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {featured.description}
          </p>
          {featured.tags.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {featured.tags.slice(0, 4).map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          ) : null}
        </a>
      ) : null}

      {rest.length > 0 ? (
        <ul className={`space-y-2 ${featured ? "mt-4" : ""}`}>
          {rest.map((post) => (
            <li key={post.slug}>
              <a
                href={`/blog/${post.slug}`}
                className="home-writing-item group flex items-start justify-between gap-3 rounded-xl border border-transparent px-3 py-3 transition hover:border-zinc-200/80 hover:bg-white/50 sm:px-4 dark:hover:border-white/10 dark:hover:bg-white/5"
              >
                <span className="min-w-0">
                  <time className="text-[11px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    {post.date}
                  </time>
                  <span className="mt-1 block text-sm font-semibold leading-snug tracking-tight text-zinc-900 group-hover:text-sky-800 dark:text-zinc-100 dark:group-hover:text-sky-200">
                    {post.title}
                  </span>
                  <span className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-600 sm:text-sm dark:text-zinc-400">
                    {post.description}
                  </span>
                </span>
                <ArrowUpRight
                  size={15}
                  className="mt-1 shrink-0 text-zinc-400 opacity-0 transition group-hover:opacity-100 group-hover:text-sky-600 dark:group-hover:text-sky-300"
                  aria-hidden
                />
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      <a
        href={href}
        className="home-spotlight-link mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200/90 bg-white/60 px-4 py-2.5 text-sm font-semibold text-zinc-800 transition hover:border-sky-400/60 hover:text-sky-700 sm:w-auto sm:justify-start dark:border-white/10 dark:bg-white/5 dark:text-zinc-100 dark:hover:text-sky-300"
      >
        Browse all articles
        <ArrowRight size={15} aria-hidden />
      </a>
    </div>
  );
}
