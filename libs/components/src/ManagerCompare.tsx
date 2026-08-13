const columns = [
  { key: "npm" as const, name: "npm" },
  { key: "yarnClassic" as const, name: "Yarn Classic" },
  { key: "yarnBerry" as const, name: "Yarn Berry" },
  { key: "pnpm" as const, name: "pnpm" },
];

const rows = [
  { topic: "Ships with Node", npm: "Yes", yarnClassic: "No", yarnBerry: "No", pnpm: "No" },
  { topic: "Lockfile", npm: "package-lock.json", yarnClassic: "yarn.lock", yarnBerry: "yarn.lock", pnpm: "pnpm-lock.yaml" },
  { topic: "Config", npm: ".npmrc", yarnClassic: ".yarnrc", yarnBerry: ".yarnrc.yml", pnpm: ".npmrc + pnpm-workspace.yaml" },
  {
    topic: "On disk",
    npm: "Hoisted node_modules",
    yarnClassic: "Hoisted node_modules",
    yarnBerry: "PnP (.pnp.cjs) or node-modules",
    pnpm: "Global store + hard links, strict tree",
  },
  { topic: "Phantom deps", npm: "Easy", yarnClassic: "Easy", yarnBerry: "Hard (PnP)", pnpm: "Hard" },
  { topic: "Disk (many apps)", npm: "Copy per project", yarnClassic: "Copy per project", yarnBerry: "Small if PnP", pnpm: "One store copy, then link" },
  { topic: "Workspaces", npm: "package.json · npx -w", yarnClassic: "package.json · yarn workspace", yarnBerry: "package.json + .yarnrc.yml", pnpm: "pnpm-workspace.yaml · --filter" },
  { topic: "Local package", npm: "workspaces or file:", yarnClassic: "workspaces", yarnBerry: "workspaces / portal:", pnpm: "workspace:*" },
  { topic: "Add / remove", npm: "npm i / uninstall", yarnClassic: "yarn add / remove", yarnBerry: "yarn add / remove", pnpm: "pnpm add / remove" },
  { topic: "Dev dep", npm: "npm i -D", yarnClassic: "yarn add -D", yarnBerry: "yarn add -D", pnpm: "pnpm add -D" },
  { topic: "Run script", npm: "npm run dev", yarnClassic: "yarn dev", yarnBerry: "yarn dev", pnpm: "pnpm dev" },
  { topic: "One-off CLI", npm: "npx …", yarnClassic: "yarn dlx …", yarnBerry: "yarn dlx …", pnpm: "pnpm dlx …" },
  { topic: "CI freeze", npm: "npm ci", yarnClassic: "yarn install --frozen-lockfile", yarnBerry: "yarn install --immutable", pnpm: "pnpm install --frozen-lockfile" },
  { topic: "Overrides", npm: "overrides", yarnClassic: "resolutions", yarnBerry: "resolutions", pnpm: "pnpm.overrides" },
  { topic: "Audit / why", npm: "npm audit · npm explain", yarnClassic: "yarn audit · yarn why", yarnBerry: "yarn npm audit · yarn why", pnpm: "pnpm audit · pnpm why" },
  { topic: "Peers", npm: "Auto-install (npm 7+)", yarnClassic: "Warns on clash", yarnBerry: "Warns; PnP is strict", pnpm: "WARN if missing" },
  { topic: "Pin version", npm: "Your Node / nvm", yarnClassic: "Corepack or global", yarnBerry: "packageManager + Corepack", pnpm: "packageManager + Corepack" },
  { topic: "Use when", npm: "Tutorials, one app", yarnClassic: "Inherited yarn.lock", yarnBerry: "Want PnP", pnpm: "Monorepo, strict, disk" },
  { topic: "Watch out", npm: "npm i in CI rewrites lockfile", yarnClassic: "Old, still common", yarnBerry: "Tools expect node_modules", pnpm: "Must declare every import" },
] as const;

export function ManagerCompare() {
  return (
    <div className="not-prose my-6 -mx-4 overflow-x-auto overscroll-x-contain border-y border-zinc-200 sm:mx-0 sm:rounded-xl sm:border dark:border-white/10">
      <table className="min-w-[40rem] w-full border-collapse text-left text-[13px] leading-snug">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-100 dark:border-white/10 dark:bg-zinc-900">
            <th className="sticky left-0 z-10 bg-zinc-100 px-3 py-2 font-semibold text-zinc-950 dark:bg-zinc-900 dark:text-white">
              Topic
            </th>
            {columns.map((column) => (
              <th key={column.key} className="px-3 py-2 font-semibold text-zinc-950 dark:text-white">
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.topic}
              className={
                index % 2 === 0
                  ? "bg-white dark:bg-zinc-950/40"
                  : "bg-zinc-50 dark:bg-zinc-900/50"
              }
            >
              <th className="sticky left-0 z-10 w-[7.5rem] bg-inherit px-3 py-2 font-medium text-zinc-800 dark:text-zinc-200">
                {row.topic}
              </th>
              {columns.map((column) => (
                <td key={column.key} className="px-3 py-2 text-zinc-600 dark:text-zinc-400">
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
