import { NavLink, ThemeToggle } from "@webdev/components";
import { usePageContext } from "vike-react/usePageContext";
import { SITE } from "./config";

const nav = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/tools", label: "Tools" },
];

export function Header() {
  const { urlPathname } = usePageContext();

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-zinc-50/85 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6 sm:py-3.5">
        <NavLink
          href="/"
          active={urlPathname === "/"}
          className="group flex min-w-0 shrink items-center gap-2.5 sm:gap-3"
        >
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-[13px] font-extrabold tracking-tight text-sky-400 shadow-[0_0_0_1px_rgba(56,189,248,0.35)] transition group-hover:shadow-[0_0_0_1px_rgba(56,189,248,0.7)] dark:bg-sky-400 dark:text-zinc-950 dark:shadow-none">
            {SITE.shortName}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-extrabold leading-tight tracking-tight text-zinc-950 sm:text-base dark:text-white">
              {SITE.name}
            </span>
            <span className="hidden text-[11px] font-medium tracking-wide text-zinc-500 sm:block dark:text-zinc-400">
              {SITE.role}
            </span>
          </span>
        </NavLink>
        <nav className="flex min-w-0 items-center gap-0 text-[13px] text-zinc-600 sm:gap-0.5 sm:text-sm dark:text-zinc-300">
          {nav.map((item) => {
            const active = urlPathname.startsWith(item.href);
            return (
              <NavLink
                key={item.href}
                href={item.href}
                active={active}
                className={`rounded-full px-2.5 py-2 transition hover:bg-zinc-200/80 hover:text-zinc-900 sm:px-3 sm:py-1.5 dark:hover:bg-white/10 dark:hover:text-white ${
                  active ? "bg-zinc-200/80 dark:bg-white/10" : ""
                }`}
              >
                {item.label}
              </NavLink>
            );
          })}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 py-8 text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} {SITE.name}
        </p>
        <p className="text-zinc-400 dark:text-zinc-500">Notes, tools, and work — dark by default.</p>
      </div>
    </footer>
  );
}
