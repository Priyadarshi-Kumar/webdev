import { tools } from "@webdev/tools";
import { SITE, getSiteUrl } from "@webdev/widgets/config";
import { toolsIndexDescription } from "./seo";

export function Head() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Developer tools",
    description: toolsIndexDescription,
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.title,
      url: `${getSiteUrl()}/tools/${tool.slug}`,
    })),
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
  );
}
