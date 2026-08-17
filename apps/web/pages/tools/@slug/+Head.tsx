import { useData } from "vike-react/useData";
import { SITE, getSiteUrl } from "@webdev/widgets/config";
import { toolPageDescription } from "../seo";
import type { Data } from "./+data";

export function Head() {
  const tool = useData<Data>();
  const url = `${getSiteUrl()}/tools/${tool.slug}`;
  const description = toolPageDescription(tool.description);

  const webApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    description,
    url,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: SITE.name,
      url: getSiteUrl(),
    },
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Tools",
        item: `${getSiteUrl()}/tools`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tool.title,
        item: url,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
    </>
  );
}
