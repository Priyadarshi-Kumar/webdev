import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, ThemeToggle } from "@webdev/components";
import { usePageContext } from "vike-react/usePageContext";
import { SITE } from "./config";

const nav = [
  { href: "/portfolio/experience", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/tools", label: "Tools" },
];

export function Header() {
  const { urlPathname } = usePageContext();
  const settingsActive = urlPathname.startsWith("/settings");

  return (
    <header className="relative z-20 shrink-0 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-2xl border border-zinc-200/80 bg-white/70 px-3 py-2 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:gap-4 sm:px-4 sm:py-2.5 dark:border-white/10 dark:bg-zinc-950/55">
        <NavLink
          href="/"
          active={urlPathname === "/"}
          className="group flex min-w-0 shrink items-center gap-2.5 sm:gap-3"
        >
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-950 to-zinc-800 font-display text-[13px] font-bold tracking-tight text-sky-300 shadow-[0_0_0_1px_rgba(56,189,248,0.35),0_8px_20px_-10px_rgba(56,189,248,0.8)] transition group-hover:shadow-[0_0_0_1px_rgba(56,189,248,0.7)] dark:from-sky-400 dark:to-cyan-300 dark:text-zinc-950 dark:shadow-none">
            {SITE.shortName}
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="block truncate font-display text-[15px] font-semibold leading-tight tracking-tight text-zinc-950 sm:text-base dark:text-white">
              {SITE.name}
            </span>
            <span className="hidden text-[11px] font-medium tracking-wide text-zinc-500 sm:block dark:text-zinc-400">
              {SITE.role}
            </span>
          </span>
        </NavLink>
        <nav className="flex min-w-0 items-center gap-1 text-[13px] text-zinc-600 sm:rounded-full sm:bg-zinc-100/80 sm:p-1 sm:text-sm dark:text-zinc-300 sm:dark:bg-white/5">
          {nav.map((item) => {
            const active =
              item.href === "/portfolio/experience"
                ? urlPathname === "/portfolio" || urlPathname.startsWith("/portfolio/")
                : urlPathname.startsWith(item.href);
            return (
              <NavLink
                key={item.href}
                href={item.href}
                active={active}
                className={`min-h-10 rounded-full px-2.5 py-2 transition sm:min-h-0 sm:px-3.5 sm:py-1.5 ${
                  active
                    ? "bg-zinc-950 text-white shadow-sm dark:bg-white dark:text-zinc-950"
                    : "hover:bg-zinc-200/80 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-white"
                }`}
              >
                {item.label}
              </NavLink>
            );
          })}
          <NavLink
            href="/settings"
            active={settingsActive}
            className={`inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border p-2 transition sm:min-h-9 sm:min-w-9 ${
              settingsActive
                ? "border-sky-400/70 bg-sky-400/15 text-sky-700 dark:text-sky-300"
                : "border-zinc-200/80 bg-white/70 text-zinc-600 hover:border-sky-400/70 hover:text-sky-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:text-sky-300"
            }`}
          >
            <span className="sr-only">Settings</span>
            <Settings size={16} aria-hidden />
          </NavLink>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

export function ReadProgress() {
  const { urlPathname } = usePageContext();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const scroller = document.getElementById("page-content");
    if (!scroller) return;

    const update = () => {
      const max = scroller.scrollHeight - scroller.clientHeight;
      if (max <= 8) {
        setProgress(0);
        return;
      }
      setProgress(Math.min(100, Math.max(0, Math.round((scroller.scrollTop / max) * 100))));
    };

    update();
    scroller.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(scroller);
    const main = scroller.querySelector("main");
    if (main) observer.observe(main);
    return () => {
      scroller.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [urlPathname]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1 bg-zinc-200/70 dark:bg-white/10"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-label="Reading progress"
    >
      <div className="reading-progress-fill h-full transition-[width] duration-150 ease-out" style={{ width: `${progress}%` }} />
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto shrink-0 px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 rounded-2xl border border-zinc-200/80 bg-white/55 px-4 py-5 text-sm text-zinc-500 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-white/10 dark:bg-zinc-950/40 dark:text-zinc-400">
        <p>
          © {new Date().getFullYear()} {SITE.name}
        </p>
        <p className="text-zinc-400 dark:text-zinc-500">Feel free to reach out!</p>
      </div>
    </footer>
  );
}
