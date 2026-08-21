import { practiceQuestions } from "@webdev/widgets";
import { getSiteUrl } from "@webdev/widgets/config";
import { practiceIndexDescription } from "./seo";

export function Head() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "JavaScript practice",
    description: practiceIndexDescription,
    numberOfItems: practiceQuestions.length,
    itemListElement: practiceQuestions.map((question, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: question.title,
      url: `${getSiteUrl()}/practice/${question.slug}`,
    })),
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
  );
}
