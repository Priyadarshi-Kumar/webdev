import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { glossary, type GlossaryId } from "./glossary";

export function Term({ id, children }: { id: GlossaryId; children: ReactNode }) {
  const uid = useId();
  const entry = glossary[id];
  const href = `/blog/${entry.slug}`;
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const hideTimer = useRef<number>(0);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  function place() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ top: rect.bottom + 8, left: rect.left + rect.width / 2 });
  }

  function show() {
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    window.clearTimeout(hideTimer.current);
    place();
    setOpen(true);
  }

  function hide() {
    hideTimer.current = window.setTimeout(() => setOpen(false), 120);
  }

  useEffect(() => {
    if (!open) return;
    const scroller = document.getElementById("page-content");
    scroller?.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
    return () => {
      scroller?.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
    };
  }, [open]);

  return (
    <span className="group/term relative inline">
      <a
        ref={triggerRef}
        href={href}
        aria-describedby={open ? uid : undefined}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        className="inline cursor-help border-b border-dotted border-sky-500/80 font-[inherit] font-medium text-sky-800 no-underline hover:text-sky-600 dark:text-sky-300 dark:hover:text-sky-200"
      >
        {children}
      </a>
      {open && typeof document !== "undefined"
        ? createPortal(
            <span
              id={uid}
              role="tooltip"
              onMouseEnter={show}
              onMouseLeave={hide}
              style={{ top: pos.top, left: pos.left }}
              className="fixed z-[200] w-72 max-w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-zinc-200 bg-white p-3 text-left text-sm font-normal leading-relaxed text-zinc-600 shadow-lg shadow-zinc-950/20 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300 dark:shadow-black/50"
            >
              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">
                In plain words
              </span>
              {entry.explain}
              <a
                href={href}
                className="mt-3 flex min-h-11 items-center font-medium text-sky-600 no-underline hover:underline dark:text-sky-400"
              >
                Full details →
              </a>
            </span>,
            document.body,
          )
        : null}
    </span>
  );
}
