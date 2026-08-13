import type { TocEntry } from "@webdev/utils";
import { useEffect, useState, type MouseEvent } from "react";

function headingIds(items: TocEntry[]): string[] {
  return items.flatMap((item) => [item.id, ...item.children.map((child) => child.id)]);
}

function jumpToHeading(event: MouseEvent<HTMLAnchorElement>, id: string, onActive: (id: string) => void) {
  event.preventDefault();
  onActive(id);
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const url = new URL(window.location.href);
  url.hash = id;
  window.history.replaceState(window.history.state, "", url);
}

function linkClass(active: boolean, nested: boolean) {
  const base = "block border-l-2 py-1 pl-3 leading-snug no-underline transition";
  if (nested) {
    return `${base} text-xs ${
      active
        ? "border-sky-400 text-sky-700 dark:text-sky-300"
        : "border-transparent text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200"
    }`;
  }
  return `${base} text-[13px] font-medium ${
    active
      ? "border-sky-400 text-zinc-950 dark:text-white"
      : "border-transparent text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
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
    <ol className="m-0 list-none space-y-2.5 border-l border-zinc-200 p-0 dark:border-white/10">
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
            <ol className="m-0 mt-0.5 list-none p-0">
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

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -55% 0px", threshold: [0, 1] },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="On this page"
      className="fixed top-24 right-6 z-10 hidden max-h-[calc(100dvh-7rem)] w-56 overflow-y-auto overscroll-contain lg:block"
    >
      <p className="eyebrow mb-4">On this page</p>
      <TocLinks items={items} activeId={activeId} onActive={setActiveId} />
    </nav>
  );
}
