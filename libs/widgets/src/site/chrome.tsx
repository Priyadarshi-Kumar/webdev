import { Github, Linkedin, Mail, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, ThemeToggle } from "@webdev/components";
import { usePageContext } from "vike-react/usePageContext";
import { SITE } from "./config";

const nav = [
  { href: "/portfolio/experience", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/tools", label: "Tools" },
];

const footerNav = [
  { href: "/portfolio/experience", label: "Experience" },
  { href: "/portfolio/skills", label: "Skills" },
  { href: "/blog", label: "Blog" },
  { href: "/tools", label: "Tools" },
  { href: "/settings", label: "Settings" },
];

export function Header() {
  const { urlPathname } = usePageContext();
  const settingsActive = urlPathname.startsWith("/settings");

  return (
    <header className="relative z-20 shrink-0 px-3 pt-3 pb-1 sm:px-4 sm:pt-4 sm:pb-0">
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
        <nav className="flex min-w-0 max-w-[58vw] items-center gap-1 overflow-x-auto text-[13px] text-zinc-600 [-ms-overflow-style:none] [scrollbar-width:none] sm:max-w-none sm:overflow-visible sm:rounded-full sm:bg-zinc-100/80 sm:p-1 sm:text-sm dark:text-zinc-300 sm:dark:bg-white/5 [&::-webkit-scrollbar]:hidden">
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
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer mt-auto shrink-0 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 sm:px-4 sm:pb-4">
      <div className="site-footer-panel mx-auto max-w-6xl overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/50">
        <div className="site-footer-accent h-px w-full" aria-hidden />
        <div className="grid gap-8 px-5 py-8 sm:px-8 sm:py-10 md:grid-cols-[minmax(0,1.4fr)_auto_auto] md:gap-10">
          <div className="min-w-0">
            <a href="/" className="inline-flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-950 to-zinc-800 font-display text-sm font-bold text-sky-300 dark:from-sky-400 dark:to-cyan-300 dark:text-zinc-950">
                {SITE.shortName}
              </span>
              <span>
                <span className="block font-display text-base font-semibold tracking-tight text-zinc-950 dark:text-white">
                  {SITE.name}
                </span>
                <span className="block text-xs text-zinc-500 dark:text-zinc-400">{SITE.role}</span>
              </span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{SITE.tagline}</p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              Explore
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-1">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-flex min-h-10 items-center text-sm font-medium text-zinc-700 transition hover:text-sky-700 dark:text-zinc-300 dark:hover:text-sky-300"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              Connect
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="footer-link inline-flex min-h-10 items-center gap-2.5 text-sm font-medium"
                >
                  <Mail size={16} aria-hidden />
                  <span className="truncate">{SITE.email}</span>
                </a>
              </li>
              <li>
                <a href={SITE.socials.linkedin} className="footer-link inline-flex min-h-10 items-center gap-2.5 text-sm font-medium">
                  <Linkedin size={16} aria-hidden />
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={SITE.socials.github} className="footer-link inline-flex min-h-10 items-center gap-2.5 text-sm font-medium">
                  <Github size={16} aria-hidden />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-zinc-200/80 px-5 py-4 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 dark:border-white/10 dark:text-zinc-400">
          <p>© {year} {SITE.name}. Built with React, Vite, and care.</p>
          <p>Open to interesting work — say hello anytime.</p>
        </div>
      </div>
    </footer>
  );
}
