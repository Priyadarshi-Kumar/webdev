const SEO_SUFFIX = "Write JavaScript in the browser, run it locally, and check hidden tests.";

export function practicePageTitle(title: string, siteName: string) {
  return `${title} — JavaScript practice | ${siteName}`;
}

export function practicePageDescription(description: string) {
  return `${description} ${SEO_SUFFIX}`;
}

export const practiceIndexDescription =
  "Practice JavaScript in the browser: functions, arrays, objects, closures, and promises. Each question has a prompt, examples, an editor, Run, and Check. Nothing is uploaded.";

export const practiceIndexTitle = (siteName: string) => `JavaScript practice — run code in the browser | ${siteName}`;
