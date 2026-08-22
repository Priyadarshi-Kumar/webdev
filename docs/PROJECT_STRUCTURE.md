# Project structure

This document explains how the `webdev` monorepo is organized, what gets built where, and why the layout looks the way it does. It lives under `docs/` for humans and agents — it is **not** shipped in the site.

For a short map, see [`AGENTS.md`](../AGENTS.md) and the root [`README.md`](../README.md).

---

## One-line mental model

**A pnpm workspace of source libraries plus one Vike static site.** Types and helpers sit at the bottom; UI and features sit in the middle; thin pages at the top compose widgets. Content is MDX on disk. Netlify publishes a single folder: `apps/web/dist/client`.

```text
                    ┌─────────────────────────────────────┐
                    │  apps/web  (Vike SSG · only ship)   │
                    │  pages compose widgets / tools      │
                    └───────────────┬─────────────────────┘
                                    │
              ┌─────────────────────┴─────────────────────┐
              ▼                                           ▼
     @webdev/widgets                              @webdev/tools
     (site, blog, portfolio,                      (browser tools +
      practice, settings)                          registry)
              │                                           │
              └─────────────────────┬─────────────────────┘
                                    ▼
                           @webdev/components
                           (Term, theme, primitives)
                                    │
                                    ▼
                            @webdev/store
                            (Zustand · prefs)
                                    │
                                    ▼
                            @webdev/utils
                            (pure helpers)
                                    │
                                    ▼
                            @webdev/types
                            (shapes only)
```

---

## Why this architecture (analogies)

### Kitchen, not buffet

Think of the site as a **kitchen line**, not a buffet of micro-apps.

| Role | Analogy | In this repo |
| --- | --- | --- |
| Types | Ingredient labels | `@webdev/types` — names and shapes, no behavior |
| Utils | Prep station | `@webdev/utils` — pure chopping; no React |
| Store | Ticket rail / prefs | `@webdev/store` — what the cook remembers (theme, progress) |
| Components | Knives and pans | `@webdev/components` — reusable primitives |
| Widgets / tools | Plated dishes | Feature UI assembled from primitives |
| `apps/web` | The dining room | Routes and chrome; almost no business UI |

Pages stay thin on purpose: a route should mostly import a widget and hand it data. If page files start owning layout logic, the dining room is doing the cooking.

### Library shelves vs shipping one box

A **monorepo** means one git tree and one install — shared shelves for code. It does **not** mean microfrontends. Microfrontends are a *deploy* choice (many independently shipped apps). This project rejects that: one app, one Netlify publish directory, one mental model for “what is live.”

### pnpm vs Nx — landlord and project manager

| Tool | Owns | Does not own |
| --- | --- | --- |
| **pnpm** | Install graph, workspace packages, lockfile | Named build jobs, “what changed” analysis |
| **Nx** | Project names, targets (`dev` / `build`), cache, affected | Replacing the package manager |

pnpm is the landlord (what packages exist and how they link). Nx is the project manager (which jobs to run and what to reuse from cache). Neither replaces the other.

### Source aliases, not library `dist` folders

Most libs have **no** separate compile step. TypeScript `paths` and Vite aliases point at `libs/*/src`. Only `apps/web` emits `dist/`. That keeps the feedback loop short (edit a widget → refresh the app) while Nx `implicitDependencies` still keep cache and affected builds honest.

Analogy: the libraries are **open drawers of ingredients**, not sealed jars you re-label before every meal. The meal (the site) is the only thing you package for delivery.

### Content as product, not a CMS

Blog posts and jargon notes are MDX files. There is no CMS or database. Adding an article is adding a file; the glossary term tooltip and the full jargon page are a deliberate pair so “hover for plain English” and “open the note” stay in sync.

---

## Top-level layout

| Path | Role |
| --- | --- |
| `apps/` | Deployable applications (`web` only today) |
| `libs/` | Shared packages (`@webdev/*`) |
| `scripts/` | Root helpers (e.g. Netlify publish) |
| `docs/` | Repo documentation (not routed in the app) |
| `AGENTS.md` | Short map for coding agents |
| `README.md` | Human overview |
| `.cursor/rules/site.mdc` | Always-on site conventions |
| `package.json` | Root scripts, Node / pnpm engines |
| `pnpm-workspace.yaml` | Declares `apps/*` and `libs/*` |
| `nx.json` | Nx layout and cache defaults |
| `tsconfig.base.json` | `@webdev/*` path aliases |
| `netlify.toml` | Build command, publish dir, redirects, headers |
| `.nvmrc` | Node `22` |

---

## What is built where

### The only shippable artifact

| Step | Command / config | Output |
| --- | --- | --- |
| Local / CI build | `pnpm build` → `nx build web` → `vike build` + sitemap script | `apps/web/dist/` |
| What Netlify serves | `publish = "apps/web/dist/client"` in `netlify.toml` | Static HTML, assets, prerendered routes |
| Libraries | No separate `dist` for libs | Consumed as TypeScript source via aliases |

Build command on Netlify:

```toml
command = "pnpm nx build web"
publish = "apps/web/dist/client"
```

Manual publish (after a local build): `pnpm deploy:site` / `pnpm deploy:draft` → `scripts/netlify-publish.mjs`.

Pushing `main` also triggers Netlify’s Git-based production build.

### Path aliases (`tsconfig.base.json`)

| Import | Points at |
| --- | --- |
| `@webdev/types` | `libs/types/src/index.ts` |
| `@webdev/utils` | `libs/utils/src/index.ts` |
| `@webdev/store` | `libs/store/src/index.ts` |
| `@webdev/components` | `libs/components/src/index.ts` |
| `@webdev/widgets` | `libs/widgets/src/index.ts` |
| `@webdev/widgets/config` | `libs/widgets/src/site/config.ts` |
| `@webdev/widgets/blog-data` | `libs/widgets/src/blog/data.ts` |
| `@webdev/widgets/portfolio-data` | `libs/widgets/src/portfolio/data.ts` |
| `@webdev/tools` | `libs/tools/src/index.ts` |

Vite mirrors these aliases so the bundler and TypeScript agree.

---

## Apps

### `apps/web` (Nx project: `web`)

The only application. Stack: **Vike (SSG) · React · Vite · Tailwind · MDX**.

| Concern | Location |
| --- | --- |
| Routes / pages | `apps/web/pages/` |
| MDX articles | `apps/web/content/topics/*.mdx` |
| Post module loader | `apps/web/src/posts.ts` (`import.meta.glob`) |
| Vite / MDX pipeline | `apps/web/vite.config.ts` |
| Global CSS | `apps/web/pages/tailwind.css` |
| Public assets | `apps/web/public/` |
| Sitemap writer | `apps/web/scripts/write-sitemap.mjs` |
| Nx targets | `apps/web/project.json` (`dev`, `build`, `preview`, …) |

**Scripts (from repo root):**

| Script | Effect |
| --- | --- |
| `pnpm dev` | `nx dev web` → `vike dev` |
| `pnpm build` | Production SSG + sitemap |
| `pnpm preview` | Build then `vike preview` |

**URL map (filesystem routing):**

| Area | Folder under `pages/` |
| --- | --- |
| `/` | `index/` |
| `/blog`, `/blog/@slug`, jargon, external | `blog/` |
| `/portfolio` (+ sections, projects) | `portfolio/` |
| `/tools`, `/tools/@slug` | `tools/` |
| `/practice`, `/practice/@slug` | `practice/` |
| `/settings` | `settings/` |
| Errors | `_error/` |

Shared chrome lives in `pages/+Layout.tsx`, `pages/+config.ts` (prerender, default `html` class `dark`), and `pages/+Head.tsx`.

There are no other apps under `apps/`.

---

## Libraries

Dependency direction is **downward only**. Lower layers must not import widgets, tools, or the app.

```text
types  →  utils  →  store  →  components  →  widgets | tools  →  apps/web
```

`widgets` and `tools` are **siblings**: both sit above components; tools do not depend on widgets.

### `@webdev/types` — `libs/types`

Shared TypeScript shapes only (`PostFrontmatter`, `Profile`, `ToolMeta`, `Theme`, practice types, …). No runtime logic.

### `@webdev/utils` — `libs/utils`

Pure helpers: TOC / rehype, frontmatter, blog subject bucketing, JSON and tool algorithms, practice runners, pagination. Safe to call from Node (prerender) or the browser.

Notable: `blog-subjects.ts` decides rail buckets (`react`, `javascript`, `browser`, `llm`, `nx`, `packages`, `backend`, `tooling`).

### `@webdev/store` — `libs/store`

Zustand client state:

- Appearance / theme (dark default, palettes, FOUC bootstrap)
- Last-read blog article
- Practice progress
- Cursor bootstrap helpers

### `@webdev/components` — `libs/components`

UI primitives used by widgets and tools: `Term`, glossary map, theme toggle, appearance sync, scroll hints, code blocks, cards, tags.

### `@webdev/widgets` — `libs/widgets`

Feature UI for the site: chrome, home, blog workspace, portfolio, practice, settings, error pages. Also holds editable data modules:

| Data | Path |
| --- | --- |
| Site identity / URL | `src/site/config.ts` |
| Portfolio profile & projects | `src/portfolio/data.ts` |
| Blog FS index / TOC for prerender | `src/blog/data.ts` |
| Practice questions | `src/practice/data.ts` |

### `@webdev/tools` — `libs/tools`

Browser tools (encode, format, generate, inspect). Register new tools in `src/registry.ts`; put UI under `src/`. Algorithms often live in `@webdev/utils`; tool components stay thin. Nothing is uploaded — tools run in the browser.

---

## How pages work (Vike)

Vike owns **URL → page module**. React widgets own the UI. MDX files are **content modules**, not routes by themselves — slugs are prerendered into `/blog/<slug>` HTML.

Typical Vike files:

| File | Role |
| --- | --- |
| `+Page.tsx` | Page UI (usually one widget) |
| `+data.ts` | Data for prerender / server |
| `+title.ts` / `+description.ts` | SEO |
| `+Head.tsx` | Extra head tags |
| `+route.ts` | Custom matching |
| `+guard.ts` | Redirects (e.g. portfolio default section) |
| `+onBeforePrerenderStart.ts` | List of URLs to SSG |
| `+config.ts` | App-wide Vike config |

Routing is **path-based** (no hash router). Netlify also 301s `/portfolio` → `/portfolio/experience`.

### Two blog loaders (intentional split)

| Loader | Path | Why |
| --- | --- | --- |
| Eager MDX modules | `apps/web/src/posts.ts` | Render the article component + frontmatter in the app |
| Filesystem parse | `@webdev/widgets/blog-data` | Meta / TOC / indexes at prerender without pulling every MDX into every data hook |

Same content, two access patterns — one for “show the page,” one for “know about all pages.”

---

## Content model

### Articles

Create only:

```text
apps/web/content/topics/<slug>.mdx
```

Required frontmatter: `title`, `description`, `slug`, `date` (`YYYY-MM-DD`), `tags`.

Optional `subject` pins the left-rail bucket when tags would mis-group the post.

Structure with markdown `##` / `###` (do not skip levels). Those headings drive the desktop “On this page” nav on the right; do not hand-write a TOC in the MDX. On mobile that nav is hidden. Section jumps **replace** the hash (Back leaves the article instead of walking headings).

### Glossary + `<Term>`

Every dotted term needs **both**:

1. An entry in `libs/components/src/glossary.ts` (`explain` + `slug`)
2. A glossary MDX page under `content/topics/<slug>.mdx` with `tags` including `glossary`

`<Term id="…">` shows a hover preview and links to `/blog/<slug>`. The tooltip is the preview; the page is the full note.

---

## Styling and theme

- **Dark is the default** (`html` class `dark` in Vike config; appearance store falls back to dark). Light mode is optional; it must not become the default.
- Tailwind v4 via Vite; `pages/tailwind.css` `@source`s into `libs/**` so classes in libraries are not purged.
- Theme accents use CSS variables driven by the appearance store.
- Fonts and atmosphere live in layout / head / global CSS — follow existing patterns when extending UI.

---

## Explicit non-goals

These are product decisions, not accidents:

| Do not | Reason |
| --- | --- |
| Add a CMS | Content is MDX files on purpose |
| Add a database | No dynamic server store for this site |
| Split into microfrontends | One deployable app |
| Use a hash router | Path-based Vike + Netlify redirects |
| Make light the default theme | Dark-first brand |
| Treat Nx as a package manager or CMS | pnpm owns install; files own content |

---

## Day-to-day change map

| You want to… | Touch |
| --- | --- |
| Add a blog / jargon page | `apps/web/content/topics/<slug>.mdx` (+ glossary pair if using `<Term>`) |
| Change portfolio copy / projects | `libs/widgets/src/portfolio/data.ts` |
| Add a browser tool | UI in `libs/tools/src/` + `registry.ts` |
| Change site name / base URL helpers | `libs/widgets/src/site/config.ts` (+ `VITE_SITE_URL` on Netlify) |
| Add a shared type | `libs/types` |
| Add a pure helper | `libs/utils` |
| Add a primitive control | `libs/components` |
| Add a feature screen | `libs/widgets` (then a thin page under `apps/web/pages/`) |
| Change deploy publish path / build | `netlify.toml`, optionally `scripts/netlify-publish.mjs` |

---

## Environment

| Variable | Where | Purpose |
| --- | --- | --- |
| `VITE_SITE_URL` | Netlify / local `.env` | Canonical URLs and sitemap |
| Node `22+` | `.nvmrc`, `engines`, Netlify `NODE_VERSION` | Runtime |
| pnpm `9.15.0` | `packageManager`, Netlify `PNPM_VERSION` | Install |

---

## Summary

Build **one** static site from `apps/web`. Keep feature code in **layered libs** so pages stay thin. Prefer **files over services** for content. Use **pnpm for packages** and **Nx for jobs**. Ship **`apps/web/dist/client`** — everything else is source that exists to make that folder correct.
