import { useData } from "vike-react/useData";
import { SITE, getSiteUrl } from "@webdev/widgets/config";
import { practicePageDescription } from "../seo";
import type { Data } from "./+data";

export function Head() {
  const question = useData<Data>();
  const url = `${getSiteUrl()}/practice/${question.slug}`;
  const description = practicePageDescription(question.description);

  const webApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: question.title,
    description,
    url,
    applicationCategory: "EducationalApplication",
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
        name: "Practice",
        item: `${getSiteUrl()}/practice`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: question.title,
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
