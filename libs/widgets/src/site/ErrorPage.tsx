import { ArrowLeft, BookOpen, Code2, Home, Sparkles, Wrench } from "lucide-react";
import { usePageContext } from "vike-react/usePageContext";

const shortcuts = [
  { href: "/", label: "Home", hint: "Start here", icon: Home },
  { href: "/portfolio/experience", label: "Portfolio", hint: "Resume and work", icon: Sparkles },
  { href: "/blog", label: "Blog", hint: "Notes and glossary", icon: BookOpen },
  { href: "/practice", label: "Practice", hint: "JavaScript katas in the browser", icon: Code2 },
  { href: "/tools", label: "Tools", hint: "Browser utilities", icon: Wrench },
];

function requestedPath(pathname: string) {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}

export function ErrorPage() {
  const pageContext = usePageContext();
  const is404 = Boolean(pageContext.is404);
  const status = is404 ? 404 : (pageContext.abortStatusCode ?? 500);
  const path = requestedPath(pageContext.urlPathname);

  const lead = is404
    ? "That URL is not on this site. It may have moved, or it was never published."
    : "The page hit an unexpected error. Refresh, or pick a destination below.";

  return (
    <section className="relative overflow-hidden pb-4 pt-2 sm:pb-8 sm:pt-6">
      <p
        aria-hidden
        className="pointer-events-none absolute -left-4 -top-10 select-none font-display text-[8.5rem] font-semibold leading-none tracking-tighter text-zinc-950/[0.06] sm:-left-8 sm:text-[14rem] dark:text-white/[0.07]"
      >
        {status}
      </p>

      <p className="eyebrow relative">{status}</p>
      <h1 className="page-title relative max-w-3xl">
        {is404 ? (
          <>
            Page <span className="text-gradient">not found</span>
          </>
        ) : (
          <>
            Something <span className="text-gradient">went wrong</span>
          </>
        )}
      </h1>
      <p className="page-lead relative">{lead}</p>

      {is404 && path && path !== "/" ? (
        <p className="relative mt-4 inline-flex max-w-full items-center rounded-full border border-zinc-200/80 bg-white/70 px-3 py-1.5 font-mono text-xs text-zinc-600 dark:border-white/10 dark:bg-zinc-950/55 dark:text-zinc-300">
          <span className="truncate">{path}</span>
        </p>
      ) : null}

      <div className="relative mt-8 flex flex-wrap gap-2 sm:mt-10 sm:gap-3">
        <a href="/" className="btn-primary inline-flex min-h-10 items-center gap-2 px-4 py-2 text-sm sm:min-h-11 sm:px-5">
          <Home size={16} aria-hidden />
          Back home
        </a>
        <button
          type="button"
          onClick={() => history.back()}
          className="btn-ghost inline-flex min-h-10 items-center gap-2 px-4 py-2 text-sm sm:min-h-11 sm:px-5"
        >
          <ArrowLeft size={16} aria-hidden />
          Go back
        </button>
      </div>

      <ul className="relative mt-8 grid gap-3 sm:mt-12 sm:grid-cols-2">
        {shortcuts.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <a href={item.href} className="card block h-full p-4 sm:p-5">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200/80 bg-white/80 text-sky-600 dark:border-white/10 dark:bg-zinc-950/60 dark:text-sky-300">
                  <Icon size={16} aria-hidden />
                </span>
                <span className="mt-3 block font-display text-base font-semibold tracking-tight text-zinc-950 dark:text-white">
                  {item.label}
                </span>
                <span className="mt-1 block text-sm text-zinc-500 dark:text-zinc-400">{item.hint}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
