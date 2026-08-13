Nx monorepo: apps in `apps/`, libraries in `libs/`.

- `apps/web` — pages compose widgets
- `libs/types` — shared types
- `libs/utils` — helpers
- `libs/store` — Zustand stores
- `libs/components` — primitives used by widgets
- `libs/widgets` — site, blog, and portfolio widgets
- `libs/tools` — JSON converter and registry
- Articles: `apps/web/content/topics/*.mdx` (`##` / `###` become the desktop-right “On this page” nav; hidden on mobile)
- Glossary: every `<Term>` needs `glossary.ts` **and** a `content/topics/<slug>.mdx` page
- Deploy: push `main` → Netlify (`pnpm nx build web`, publish `apps/web/dist/client`)
