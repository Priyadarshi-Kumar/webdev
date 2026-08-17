import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

type Edges = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
};

const hidden: Edges = { up: false, down: false, left: false, right: false };
const slack = 10;

function measure(el: HTMLElement): Edges {
  return {
    up: el.scrollTop > slack,
    down: el.scrollTop + el.clientHeight < el.scrollHeight - slack,
    left: el.scrollLeft > slack,
    right: el.scrollLeft + el.clientWidth < el.scrollWidth - slack,
  };
}

function same(a: Edges, b: Edges) {
  return a.up === b.up && a.down === b.down && a.left === b.left && a.right === b.right;
}

function HintButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200/80 bg-white/90 text-zinc-600 shadow-[0_8px_20px_-12px_rgba(15,23,42,0.45)] backdrop-blur-md transition hover:border-sky-400 hover:text-sky-600 dark:border-white/12 dark:bg-zinc-950/85 dark:text-zinc-300 dark:hover:border-sky-400/70 dark:hover:text-sky-300"
    >
      {children}
    </button>
  );
}

export function ScrollHints({
  id,
  className = "",
  frameClassName = "",
  children,
}: {
  id?: string;
  className?: string;
  frameClassName?: string;
  children: ReactNode;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState<Edges>(hidden);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const update = () => {
      const next = measure(el);
      setEdges((prev) => (same(prev, next) ? prev : next));
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const resize = new ResizeObserver(update);
    resize.observe(el);
    const mutation = new MutationObserver(update);
    mutation.observe(el, { childList: true, subtree: true, characterData: true });
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      resize.disconnect();
      mutation.disconnect();
    };
  }, []);

  function nudge(direction: keyof Edges) {
    const el = scrollerRef.current;
    if (!el) return;
    const y = Math.max(140, Math.round(el.clientHeight * 0.7));
    const x = Math.max(140, Math.round(el.clientWidth * 0.7));
    const delta = {
      up: { top: -y, left: 0 },
      down: { top: y, left: 0 },
      left: { top: 0, left: -x },
      right: { top: 0, left: x },
    }[direction];
    el.scrollBy({ ...delta, behavior: "smooth" });
  }

  return (
    <div className={`relative min-h-0 ${frameClassName}`.trim()}>
      <div id={id} ref={scrollerRef} className={className}>
        {children}
      </div>
      {edges.up ? (
        <div className="scroll-hint-fade scroll-hint-fade-up pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-center pt-1.5">
          <HintButton label="Scroll up" onClick={() => nudge("up")}>
            <ChevronUp size={16} aria-hidden />
          </HintButton>
        </div>
      ) : null}
      {edges.down ? (
        <div className="scroll-hint-fade scroll-hint-fade-down pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-center pb-1.5">
          <HintButton label="Scroll down" onClick={() => nudge("down")}>
            <ChevronDown size={16} aria-hidden />
          </HintButton>
        </div>
      ) : null}
      {edges.left ? (
        <div className="scroll-hint-fade scroll-hint-fade-left pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-1.5">
          <HintButton label="Scroll left" onClick={() => nudge("left")}>
            <ChevronLeft size={16} aria-hidden />
          </HintButton>
        </div>
      ) : null}
      {edges.right ? (
        <div className="scroll-hint-fade scroll-hint-fade-right pointer-events-none absolute inset-y-0 right-0 z-10 flex items-center pr-1.5">
          <HintButton label="Scroll right" onClick={() => nudge("right")}>
            <ChevronRight size={16} aria-hidden />
          </HintButton>
        </div>
      ) : null}
    </div>
  );
}
