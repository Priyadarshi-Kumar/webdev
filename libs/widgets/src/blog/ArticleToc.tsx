import { ScrollHints } from "@webdev/components";
import type { TocEntry } from "@webdev/utils";
import { useEffect, useState, type MouseEvent } from "react";

function headingIds(items: TocEntry[]): string[] {
  return items.flatMap((item) => [item.id, ...item.children.map((child) => child.id)]);
}

function pageScroller() {
  return document.getElementById("page-content");
}

function jumpToHeading(event: MouseEvent<HTMLAnchorElement>, id: string, onActive: (id: string) => void) {
  event.preventDefault();
  onActive(id);
  const scroller = pageScroller();
  const heading = document.getElementById(id);
  if (scroller && heading) {
    const top = heading.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 16;
    scroller.scrollTo({ top, behavior: "smooth" });
  }
  const url = new URL(window.location.href);
  url.hash = id;
  window.history.replaceState(window.history.state, "", url);
}

function linkClass(active: boolean, nested: boolean) {
  const base = "block border-l py-1 leading-snug no-underline transition";
  if (nested) {
    return `${base} pl-3.5 text-[11px] ${
      active
        ? "border-sky-400/70 text-zinc-700 dark:text-zinc-200"
        : "border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
    }`;
  }
  return `${base} pl-2.5 text-[12px] ${
    active
      ? "border-sky-400/80 text-zinc-800 dark:text-zinc-100"
      : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
  }`;
}

function TocLinks({
  items,
  activeId,
  onActive,
}: {
  items: TocEntry[];
  activeId: string;
  onActive: (id: string) => void;
}) {
  return (
    <ol className="m-0 list-none space-y-0.5 border-l border-zinc-200/80 p-0 dark:border-white/12">
      {items.map((item) => (
        <li key={item.id} className="m-0">
          <a
            href={`#${item.id}`}
            onClick={(event) => jumpToHeading(event, item.id, onActive)}
            className={linkClass(activeId === item.id, false)}
          >
            {item.text}
          </a>
          {item.children.length > 0 ? (
            <ol className="m-0 list-none p-0">
              {item.children.map((child) => (
                <li key={child.id} className="m-0">
                  <a
                    href={`#${child.id}`}
                    onClick={(event) => jumpToHeading(event, child.id, onActive)}
                    className={linkClass(activeId === child.id, true)}
                  >
                    {child.text}
                  </a>
                </li>
              ))}
            </ol>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export function ArticleToc({ items }: { items: TocEntry[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const nodes = headingIds(items)
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);
    if (nodes.length === 0) return;

    const scroller = pageScroller();
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { root: scroller, rootMargin: "0px 0px -55% 0px", threshold: [0, 1] },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="On this page"
      className="article-toc pointer-events-none fixed top-28 right-16 z-30 hidden w-52 lg:block"
    >
      <p className="pointer-events-auto mb-2.5 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
        On this page
      </p>
      <ScrollHints
        frameClassName="pointer-events-auto max-h-[calc(100dvh-16rem)]"
        className="rail-scroll max-h-[calc(100dvh-16rem)] overflow-y-auto"
      >
        <TocLinks items={items} activeId={activeId} onActive={setActiveId} />
      </ScrollHints>
    </nav>
  );
}
