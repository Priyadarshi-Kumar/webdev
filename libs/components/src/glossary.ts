export const glossary = {
  "package-manager": {
    slug: "package-manager",
    explain:
      "A program that downloads the libraries your project needs, remembers the versions, and puts the files on your computer.",
  },
  "npm-registry": {
    slug: "npm-registry",
    explain:
      "The public warehouse of JavaScript libraries (npmjs.com). npm, Yarn, and pnpm all fetch from this same place — they are not three different stores.",
  },
  "node-modules": {
    slug: "node-modules",
    explain: "A folder in your project where installed libraries actually live, so Node can import them.",
  },
  monorepo: {
    slug: "monorepo",
    explain:
      "One git repository that holds several apps or libraries together, with a single install at the root instead of a separate install in every folder.",
  },
  "package-json": {
    slug: "package-json",
    explain:
      "A file that lists your project’s name, scripts, and which libraries it needs — including version ranges, not exact pins.",
  },
  "semver-range": {
    slug: "semver-range",
    explain: "A version like ^19.2.8 that allows newer compatible releases. A pin is an exact version such as 19.2.8 with no caret.",
  },
  lockfile: {
    slug: "lockfile",
    explain: "The receipt: the exact versions of every package that were installed last time, so every computer can repeat that install.",
  },
  hoisting: {
    slug: "hoisting",
    explain:
      "Lifting nested libraries up into the top node_modules folder so one copy is shared. Handy, but your app can accidentally import libraries it never listed.",
  },
  "yarn-plug-n-play": {
    slug: "yarn-plug-n-play",
    explain:
      "Yarn’s mode where Node does not look in a node_modules folder. Instead it reads a map file (.pnp.cjs) that says exactly where each package lives.",
  },
  "yarn-classic": {
    slug: "yarn-classic",
    explain:
      "The first Yarn (v1). It still uses a node_modules folder, a lot like npm, plus a yarn.lock file. Many older companies still run this.",
  },
  "yarn-berry": {
    slug: "yarn-berry",
    explain: "Yarn version 2 and later. New features, and Plug’n’Play by default unless you turn node_modules back on.",
  },
  "npx-and-dlx": {
    slug: "npx-and-dlx",
    explain: "Run a published command once without adding it to your project. npx is npm’s version; Yarn and pnpm call it dlx.",
  },
  ci: {
    slug: "continuous-integration",
    explain:
      "Continuous Integration: the robot (GitHub Actions, Netlify, and similar) that installs and builds your app on a clean machine whenever you push code.",
  },
  "npm-ci": {
    slug: "npm-ci",
    explain:
      "npm’s clean install: throw away node_modules, read the lockfile, install exactly that, and fail if the lockfile does not match package.json. Use this in CI.",
  },
  "phantom-dependency": {
    slug: "phantom-dependency",
    explain:
      "A library your code imports that you never listed in package.json. It only works because some other package happened to leave it in node_modules. Upgrades can make it vanish.",
  },
  "content-addressable-store": {
    slug: "content-addressable-store",
    explain:
      "A shared cache on your computer keyed by the package contents. The same React version used by ten projects is stored once, not copied ten times.",
  },
  "hard-links": {
    slug: "hard-links",
    explain:
      "Two folder names that point at the same bytes on disk. Deleting one project does not delete the shared copy in the store. This is how pnpm saves space.",
  },
  "shamefully-hoist": {
    slug: "shamefully-hoist",
    explain:
      "A pnpm setting that flattens node_modules like npm. It can make old tools work, but you lose pnpm’s “you must declare what you import” protection.",
  },
  "workspace-protocol": {
    slug: "workspace-protocol",
    explain: "A version that means “use the copy of this package that lives in this repo,” not a version from the public registry.",
  },
  "peer-dependency": {
    slug: "peer-dependency",
    explain:
      "A library you must provide yourself (usually React). The plugin expects to share your copy instead of shipping a second one, which would break hooks.",
  },
  corepack: {
    slug: "corepack",
    explain:
      "A tool that ships with Node. It reads packageManager from package.json and runs that exact pnpm or Yarn version, so laptops and CI match.",
  },
  "react-hook": {
    slug: "react-hook",
    explain:
      "A function whose name starts with use that lets a function component remember state, run side effects, or read React features. You call it at the top of the component, not inside loops or conditions.",
  },
  "custom-hook": {
    slug: "custom-hook",
    explain:
      "A function you write that starts with use and calls other hooks. It is how you share stateful logic between components without copy-paste or higher-order components.",
  },
  "react-use": {
    slug: "react-use",
    explain:
      "A value that is not ready yet. use(promise) pauses the component until the promise resolves, then continues with the result. A Suspense boundary above shows a fallback while you wait.",
  },
  "react-suspense": {
    slug: "react-suspense",
    explain: "A React boundary that shows a fallback UI (spinner, skeleton) while a child is waiting on data or code.",
  },
  "react-form-action": {
    slug: "react-form-action",
    explain:
      "A function you pass to a form’s action prop (or call from a transition). React treats it as an Action: it can be async, and React tracks pending state for you.",
  },
  hydration: {
    slug: "hydration",
    explain:
      "HTML generated on the server. The browser must reuse the same ids when it “hydrates” (attaches React to that HTML). useId is built so server and client generate the same string.",
  },
  "react-tearing": {
    slug: "react-tearing",
    explain:
      "The server HTML says one thing, the first client render says another. React warns and may redo the tree. External stores that read “the current time” or “window width” during render are a common cause.",
  },
  "prop-drilling": {
    slug: "prop-drilling",
    explain:
      "Threading a prop through components that do not use it, only so a child far below can read it. Context skips the middle layers.",
  },
  "react-compiler": {
    slug: "react-compiler",
    explain:
      "A build tool that automatically memoizes components and values so you write fewer useMemo and useCallback calls. It is optional; hooks still exist.",
  },
  "stale-closure": {
    slug: "stale-closure",
    explain:
      "A function from an old render that still sees old props or state. The click handler thinks count is 0 after you already clicked.",
  },
  "concurrent-rendering": {
    slug: "concurrent-rendering",
    explain:
      "React may start a render, pause it, or throw it away if something more urgent happens. Updates you mark as non-urgent can wait so typing stays smooth.",
  },
  "server-components": {
    slug: "server-components",
    explain:
      "Components that run on the server, can read files or databases, and send HTML to the browser. They do not use useState or useEffect.",
  },
  nx: {
    slug: "nx",
    explain:
      "A build tool for monorepos. It knows which apps and libraries depend on which, caches task results, and can rerun only what a git change actually touched.",
  },
  "nx-project": {
    slug: "nx-project",
    explain:
      "One app or library Nx knows about — usually a folder with project.json. It has a name (web, utils) and named jobs called targets (build, test, dev).",
  },
  "project-graph": {
    slug: "project-graph",
    explain:
      "Nx’s map of the repo: boxes for projects, arrows for “this package imports that one.” Task order, cache, and affected all read this map.",
  },
  "nx-cache": {
    slug: "nx-cache",
    explain:
      "Nx hashes a task’s inputs. If it has seen that hash before, it restores the previous output instead of running the command again. Local by default; can be shared in CI.",
  },
  "nx-affected": {
    slug: "nx-affected",
    explain:
      "Run a target only on projects whose files changed in git, plus any project that depends on those. Saves CI from rebuilding the whole monorepo.",
  },
  mcp: {
    slug: "mcp",
    explain:
      "Model Context Protocol: an open JSON-RPC standard so AI apps can discover and use tools, files, and prompt templates from outside programs, instead of a custom plugin for each app.",
  },
  "mcp-host": {
    slug: "mcp-host",
    explain:
      "The AI application the human is using — Cursor, Claude Desktop, a chat product. It owns the model, the UI, and which MCP servers are allowed to run.",
  },
  "mcp-client": {
    slug: "mcp-client",
    explain:
      "The connector inside the host that speaks MCP to one server: initialize, list tools, call them, stream results. One host often runs several clients at once.",
  },
  "mcp-server": {
    slug: "mcp-server",
    explain:
      "A program that exposes tools, resources, and/or prompts over MCP. Local (stdio) or remote (HTTP). It does not run the LLM; it answers structured requests.",
  },
  "mcp-tool": {
    slug: "mcp-tool",
    explain:
      "A named function the model can call, with a JSON Schema for arguments. Side effects live here: search, write a file, query an API.",
  },
  "mcp-resource": {
    slug: "mcp-resource",
    explain:
      "Read-only context identified by a URI (file, ticket, schema dump). The host or user attaches it; it is not an action the model executes.",
  },
  "mcp-prompt": {
    slug: "mcp-prompt",
    explain:
      "A named message template the server offers (slash-command style). The user picks it; the host fills arguments and sends the resulting messages to the model.",
  },
  "json-rpc": {
    slug: "json-rpc",
    explain:
      "A simple request/response format in JSON: method name, params, and an id. MCP messages are JSON-RPC 2.0 (plus notifications with no id).",
  },
} as const;

export type GlossaryId = keyof typeof glossary;
