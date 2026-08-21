import { BookOpen, Briefcase, Github, Linkedin, Mail, Menu, Settings, Wrench, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { NavLink, ThemeToggle } from "@webdev/components";
import { usePageContext } from "vike-react/usePageContext";
import { SITE } from "./config";

const nav = [
  { href: "/portfolio/experience", label: "Portfolio", icon: Briefcase, match: (path: string) => path === "/portfolio" || path.startsWith("/portfolio/") },
  { href: "/blog", label: "Blog", icon: BookOpen, match: (path: string) => path.startsWith("/blog") },
  { href: "/tools", label: "Tools", icon: Wrench, match: (path: string) => path.startsWith("/tools") },
] as const;

const footerNav = [
  { href: "/portfolio/experience", label: "Experience" },
  { href: "/portfolio/skills", label: "Skills" },
  { href: "/blog", label: "Blog" },
  { href: "/tools", label: "Tools" },
  { href: "/settings", label: "Settings" },
];

function isActive(path: string, match: (path: string) => boolean) {
  return match(path);
}

function HeaderNavLink({
  href,
  active,
  label,
  icon: Icon,
  onNavigate,
  className = "",
}: {
  href: string;
  active: boolean;
  label: string;
  icon?: typeof Briefcase;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <NavLink
      href={href}
      active={active}
      onClick={onNavigate}
      className={`site-header-link ${active ? "site-header-link-active" : ""} ${className}`.trim()}
    >
      {Icon ? <Icon size={16} strokeWidth={active ? 2.25 : 1.9} aria-hidden /> : null}
      <span>{label}</span>
    </NavLink>
  );
}

function SettingsButton({ active, onNavigate, className = "" }: { active: boolean; onNavigate?: () => void; className?: string }) {
  return (
    <NavLink
      href="/settings"
      active={active}
      onClick={onNavigate}
      className={`site-header-icon-btn ${active ? "site-header-icon-btn-active" : ""} ${className}`.trim()}
    >
      <span className="sr-only">Settings</span>
      <Settings size={16} aria-hidden />
    </NavLink>
  );
}

export function Header() {
  const { urlPathname } = usePageContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const settingsActive = urlPathname.startsWith("/settings");

  useEffect(() => {
    setMenuOpen(false);
  }, [urlPathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header relative z-30 shrink-0 px-3 pt-3 pb-1 sm:px-4 sm:pt-4 sm:pb-0">
      <div className="site-header-shell mx-auto max-w-6xl">
        <div className="site-header-bar flex items-center justify-between gap-2 sm:gap-3">
          <NavLink
            href="/"
            active={urlPathname === "/"}
            className="site-header-brand group flex min-w-0 shrink items-center gap-2.5 sm:gap-3"
          >
            <span className="site-header-mark inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-display text-[13px] font-bold tracking-tight">
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

          <nav aria-label="Primary" className="site-header-nav hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <HeaderNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={isActive(urlPathname, item.match)}
              />
            ))}
          </nav>

          <div className="hidden items-center gap-1.5 md:flex">
            <a href={`mailto:${SITE.email}`} className="site-header-cta">
              <Mail size={14} aria-hidden />
              <span>Let's talk</span>
            </a>
            <SettingsButton active={settingsActive} />
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="site-header-menu-btn"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
              {menuOpen ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <button
            type="button"
            className="site-header-backdrop md:hidden"
            aria-label="Close menu"
            onClick={closeMenu}
          />
        ) : null}

        <div
          id={menuId}
          className={`site-header-drawer md:hidden ${menuOpen ? "site-header-drawer-open" : ""}`}
          hidden={!menuOpen}
        >
          <nav aria-label="Mobile primary" className="flex flex-col gap-1">
            {nav.map((item) => (
              <HeaderNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={isActive(urlPathname, item.match)}
                onNavigate={closeMenu}
                className="site-header-drawer-link"
              />
            ))}
            <HeaderNavLink
              href="/settings"
              label="Settings"
              icon={Settings}
              active={settingsActive}
              onNavigate={closeMenu}
              className="site-header-drawer-link"
            />
          </nav>

          <div className="site-header-drawer-footer">
            <a href={`mailto:${SITE.email}`} className="site-header-drawer-cta" onClick={closeMenu}>
              <Mail size={16} aria-hidden />
              Email me
            </a>
            <div className="flex flex-wrap gap-2">
              <a href={SITE.socials.linkedin} className="site-header-drawer-chip" onClick={closeMenu}>
                <Linkedin size={14} aria-hidden />
                LinkedIn
              </a>
              <a href={SITE.socials.github} className="site-header-drawer-chip" onClick={closeMenu}>
                <Github size={14} aria-hidden />
                GitHub
              </a>
            </div>
          </div>
        </div>
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
              <span className="site-header-mark inline-flex h-10 w-10 items-center justify-center rounded-xl font-display text-sm font-bold">
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
