# Priyadarshi Kumar

Personal site: landing, portfolio, tech blog, and browser tools.

## Stack

pnpm · Nx · Vite · Vike (SSG) · React · TypeScript · Tailwind · MDX · Zustand

## Layout

Apps (`apps/`):

- `apps/web` — pages that compose widgets

Libraries (`libs/`):

- `libs/types` — `@webdev/types`
- `libs/utils` — `@webdev/utils`
- `libs/store` — `@webdev/store`
- `libs/components` — `@webdev/components`
- `libs/widgets` — `@webdev/widgets` (site, blog, portfolio)
- `libs/tools` — `@webdev/tools`

## Develop

Needs Node 22+. From the repo root:

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

Output: `apps/web/dist/client` (this is what Netlify publishes).

## Content

- New article: add `apps/web/content/topics/<slug>.mdx`
- Portfolio: edit `libs/widgets/src/portfolio/data.ts`
- New tool: add UI in `libs/tools` and register in `libs/tools/src/registry.ts`

## Deploy

Push to `main` on GitHub. Netlify runs `pnpm nx build web` and publishes `apps/web/dist/client`.

Set `VITE_SITE_URL` in Netlify to your production domain (canonical URLs and sitemap).
