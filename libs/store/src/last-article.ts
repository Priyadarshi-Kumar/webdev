export const LAST_ARTICLE_STORAGE_KEY = "blog-last-article";

export type LastArticle = {
  slug: string;
  title: string;
  readAt: string;
};

export function readLastArticle(): LastArticle | null {
  try {
    const raw = localStorage.getItem(LAST_ARTICLE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LastArticle;
    if (typeof parsed.slug !== "string" || typeof parsed.title !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeLastArticle(article: LastArticle) {
  try {
    localStorage.setItem(LAST_ARTICLE_STORAGE_KEY, JSON.stringify(article));
  } catch {
    /* ignore quota / private mode */
  }
}

export function resolveLastArticleSlug(validSlugs: readonly string[]): string | undefined {
  const last = readLastArticle();
  if (!last) return undefined;
  return validSlugs.includes(last.slug) ? last.slug : undefined;
}
