const DONE_KEY = "practice-passed";

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

export function readDoneSlugs(): string[] {
  const parsed = readJson<unknown>(DONE_KEY, []);
  return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
}

export function setDone(slug: string, done: boolean): string[] {
  const next = new Set(readDoneSlugs());
  if (done) next.add(slug);
  else next.delete(slug);
  const list = [...next];
  writeJson(DONE_KEY, list);
  return list;
}
