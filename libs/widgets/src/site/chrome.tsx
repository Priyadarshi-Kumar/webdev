import { Github, Linkedin, Mail, Menu, Settings, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { NavLink, ThemeToggle } from "@webdev/components";
import { usePageContext } from "vike-react/usePageContext";
import { SITE } from "./config";

const nav = [
  { href: "/portfolio/experience", label: "Portfolio" },
  { href: "/blog", label: "Notes" },
  { href: "/practice", label: "Practice" },
  { href: "/tools", label: "Tools" },
];

function navItemActive(urlPathname: string, href: string) {
  if (href === "/portfolio/experience") {
    return urlPathname === "/portfolio" || urlPathname.startsWith("/portfolio/");
  }
  return urlPathname.startsWith(href);
}

export function Header() {
  const { urlPathname } = usePageContext();
  const isHome = urlPathname === "/";
  const settingsActive = urlPathname.startsWith("/settings");

  return (
    <>
      <header
        className={`relative z-20 shrink-0 px-3 pt-3 pb-1 sm:px-4 sm:pt-4 sm:pb-0 ${
          isHome ? "" : "hidden lg:block"
        }`}
      >
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
              const active = navItemActive(urlPathname, item.href);
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
      {isHome ? null : <MobileNavFab urlPathname={urlPathname} />}
    </>
  );
}

function MobileNavFab({ urlPathname }: { urlPathname: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const settingsActive = urlPathname.startsWith("/settings");

  useEffect(() => {
    setOpen(false);
  }, [urlPathname]);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      const firstLink = panelRef.current?.querySelector<HTMLElement>("a, button");
      firstLink?.focus();
      return;
    }
    buttonRef.current?.blur();
  }, [open]);

  return (
    <div className="site-mobile-nav pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-end p-3 pt-[max(0.75rem,env(safe-area-inset-top))] pr-[max(0.75rem,env(safe-area-inset-right))] lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => !value)}
        className="pointer-events-auto relative z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-sky-400 bg-white/90 text-zinc-700 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.45)] backdrop-blur-md transition hover:border-sky-300 hover:text-sky-700 dark:border-sky-400 dark:bg-zinc-950/80 dark:text-zinc-200 dark:hover:border-sky-300 dark:hover:text-sky-300"
      >
        <span className="sr-only">{open ? "Close navigation" : "Open navigation"}</span>
        {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
      </button>

      {open ? (
        <div className="pointer-events-auto fixed inset-0 z-40 lg:hidden" role="presentation">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-zinc-950/45 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="absolute top-[max(3.75rem,calc(env(safe-area-inset-top)+3rem))] right-[max(0.75rem,env(safe-area-inset-right))] w-[min(18rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/95 shadow-[0_16px_40px_-18px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/95"
          >
            <div className="border-b border-zinc-200/80 px-3 py-3 dark:border-white/10">
              <NavLink
                href="/"
                active={false}
                className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-zinc-100/80 dark:hover:bg-white/5"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-950 to-zinc-800 font-display text-[13px] font-bold tracking-tight text-sky-300 dark:from-sky-400 dark:to-cyan-300 dark:text-zinc-950">
                  {SITE.shortName}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-display text-sm font-semibold text-zinc-950 dark:text-white">
                    Home
                  </span>
                  <span className="block truncate text-[11px] text-zinc-500 dark:text-zinc-400">{SITE.name}</span>
                </span>
              </NavLink>
            </div>
            <nav className="flex flex-col gap-0.5 p-2">
              {nav.map((item) => {
                const active = navItemActive(urlPathname, item.href);
                return (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    active={active}
                    className={`rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      active
                        ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                        : "text-zinc-700 hover:bg-zinc-100/80 dark:text-zinc-200 dark:hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
            <div className="flex items-center justify-between gap-2 border-t border-zinc-200/80 px-3 py-2.5 dark:border-white/10">
              <NavLink
                href="/settings"
                active={settingsActive}
                className={`inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full border px-3 text-sm font-medium transition ${
                  settingsActive
                    ? "border-sky-400/70 bg-sky-400/15 text-sky-700 dark:text-sky-300"
                    : "border-zinc-200/80 text-zinc-600 hover:border-sky-400/70 hover:text-sky-600 dark:border-white/10 dark:text-zinc-300 dark:hover:text-sky-300"
                }`}
              >
                <Settings size={16} aria-hidden />
                Settings
              </NavLink>
              <ThemeToggle />
            </div>
          </div>
        </div>
      ) : null}
    </div>
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
    <footer className="site-footer shrink-0 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 sm:px-4 sm:pb-3 lg:mt-auto">
      <div className="site-footer-panel mx-auto flex max-w-6xl items-center justify-center gap-1 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/60 px-3 py-1.5 backdrop-blur-xl sm:gap-2 sm:px-4 dark:border-white/10 dark:bg-zinc-950/50">
        <a
          href={`mailto:${SITE.email}`}
          className="footer-link inline-flex min-h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium sm:px-3"
        >
          <Mail size={14} aria-hidden />
          Email
        </a>
        <a
          href={SITE.socials.linkedin}
          className="footer-link inline-flex min-h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium sm:px-3"
        >
          <Linkedin size={14} aria-hidden />
          LinkedIn
        </a>
        <a
          href={SITE.socials.github}
          className="footer-link inline-flex min-h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium sm:px-3"
        >
          <Github size={14} aria-hidden />
          GitHub
        </a>
      </div>
    </footer>
  );
}
