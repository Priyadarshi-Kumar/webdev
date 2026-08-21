import { APPEARANCE_BOOTSTRAP, CURSOR_BOOTSTRAP } from "@webdev/store";
import { usePageContext } from "vike-react/usePageContext";
import { SITE, getSiteUrl } from "@webdev/widgets/config";

export function Head() {
  const pageContext = usePageContext();
  const canonical = `${getSiteUrl()}${pageContext.urlPathname === "/" ? "" : pageContext.urlPathname}`;
  const title = (pageContext as { title?: string }).title ?? `${SITE.name} — ${SITE.role}`;
  const description = (pageContext as { description?: string }).description ?? SITE.description;

  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="canonical" href={canonical} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Outfit:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <script dangerouslySetInnerHTML={{ __html: APPEARANCE_BOOTSTRAP }} />
      <script dangerouslySetInnerHTML={{ __html: CURSOR_BOOTSTRAP }} />
    </>
  );
}
