import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "apps/web/dist/client");
const draftOnly = process.argv.includes("--draft");
const siteId =
  process.env.NETLIFY_SITE_ID ??
  (existsSync(path.join(root, ".netlify/state.json"))
    ? JSON.parse(readFileSync(path.join(root, ".netlify/state.json"), "utf8")).siteId
    : "a3a19f30-d290-43db-b119-c7f88b65559d");

if (!existsSync(dir)) {
  console.error("Missing apps/web/dist/client. Build first.");
  process.exit(1);
}

function parseJson(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error(`No JSON in deploy output:\n${text.slice(-800)}`);
  }
  return JSON.parse(text.slice(start, end + 1));
}

function netlifyToken() {
  if (process.env.NETLIFY_AUTH_TOKEN) return process.env.NETLIFY_AUTH_TOKEN;
  const candidates = [
    path.join(os.homedir(), "Library/Preferences/netlify/config.json"),
    path.join(os.homedir(), ".config/netlify/config.json"),
    path.join(os.homedir(), "AppData/Roaming/netlify/Config/config.json"),
  ];
  for (const file of candidates) {
    if (!existsSync(file)) continue;
    const users = JSON.parse(readFileSync(file, "utf8")).users ?? {};
    const token = Object.values(users)[0]?.auth?.token;
    if (token) return token;
  }
  throw new Error("Not logged in. Run: npx netlify-cli login");
}

const output = execFileSync(
  "npx",
  [
    "-y",
    "netlify-cli",
    "deploy",
    "--filter",
    "web",
    "--site",
    siteId,
    "--dir",
    dir,
    "--no-build",
    "--json",
    "--message",
    draftOnly ? "Local draft deploy" : "Local production publish",
  ],
  {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, CI: "true" },
    stdio: ["ignore", "pipe", "inherit"],
  },
);

const result = parseJson(output);
const deployId = result.deploy_id ?? result.deployId;
if (!deployId) {
  throw new Error(`Deploy succeeded but no id was returned: ${output.slice(-800)}`);
}

const draftUrl = result.deploy_url ?? result.url;
if (draftOnly) {
  console.log(`Draft: ${draftUrl}`);
  process.exit(0);
}

const res = await fetch(`https://api.netlify.com/api/v1/deploys/${deployId}/restore`, {
  method: "POST",
  headers: { Authorization: `Bearer ${netlifyToken()}` },
});
if (!res.ok) {
  throw new Error(`Publish failed ${res.status}: ${(await res.text()).slice(0, 800)}`);
}

console.log(`Live: ${result.site_url ?? "https://priyadarshi-kumar.netlify.app"}`);
console.log(`Draft: ${draftUrl}`);
