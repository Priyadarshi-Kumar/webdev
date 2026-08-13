import type { ReactNode } from "react";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function Card({
  href,
  children,
  className = "",
}: {
  href?: string;
  children: ReactNode;
  className?: string;
}) {
  const classes = `card ${href ? "block h-full" : ""} ${className}`.trim();
  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return <div className={classes}>{children}</div>;
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-zinc-200 px-2.5 py-0.5 text-[11px] font-medium text-zinc-500 dark:border-white/10 dark:text-zinc-400">
      {children}
    </span>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function NavLink({
  href,
  active,
  className = "",
  children,
}: {
  href: string;
  active?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a href={href} className={`${className} ${active ? "text-sky-400" : ""}`.trim()}>
      {children}
    </a>
  );
}
