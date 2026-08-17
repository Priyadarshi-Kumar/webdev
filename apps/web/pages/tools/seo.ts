const SEO_SUFFIX = "Runs in your browser — free, private, no upload.";

export function toolPageTitle(title: string, siteName: string) {
  return `${title} — Free Online Developer Tool | ${siteName}`;
}

export function toolPageDescription(description: string) {
  return `${description} ${SEO_SUFFIX}`;
}

export const toolsIndexDescription =
  "Free browser developer tools: JSON formatter, Base64 encoder, JWT decoder, UUID generator, regex tester, timestamp converter, password generator, and more. Nothing is uploaded — everything runs locally.";

export const toolsIndexTitle = (siteName: string) => `Developer Tools — Free Online Utilities | ${siteName}`;
