const PASSED_KEY = "practice-passed";
const DRAFTS_KEY = "practice-drafts";
const SPLIT_KEY = "practice-split-pct";
const DEFAULT_SPLIT = 38;
const MIN_SPLIT = 22;
const MAX_SPLIT = 68;

function readJson<T>(key: string, fallback: T): T {
  if (typeof localStorage === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / private mode */
  }
}

export function readPassedSlugs(): string[] {
  const parsed = readJson<unknown>(PASSED_KEY, []);
  return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
}

export function markPassed(slug: string) {
  const next = new Set(readPassedSlugs());
  next.add(slug);
  writeJson(PASSED_KEY, [...next]);
}

export function readDraft(slug: string): string | null {
  const drafts = readJson<Record<string, unknown>>(DRAFTS_KEY, {});
  const value = drafts[slug];
  return typeof value === "string" ? value : null;
}

export function writeDraft(slug: string, code: string) {
  const drafts = readJson<Record<string, string>>(DRAFTS_KEY, {});
  drafts[slug] = code;
  writeJson(DRAFTS_KEY, drafts);
}

export function clearDraft(slug: string) {
  const drafts = readJson<Record<string, string>>(DRAFTS_KEY, {});
  delete drafts[slug];
  writeJson(DRAFTS_KEY, drafts);
}

export function clampPracticeSplit(pct: number) {
  return Math.min(MAX_SPLIT, Math.max(MIN_SPLIT, pct));
}

export function readPracticeSplit(): number {
  const parsed = readJson<unknown>(SPLIT_KEY, DEFAULT_SPLIT);
  return typeof parsed === "number" && Number.isFinite(parsed) ? clampPracticeSplit(parsed) : DEFAULT_SPLIT;
}

export function writePracticeSplit(pct: number) {
  writeJson(SPLIT_KEY, clampPracticeSplit(pct));
}
