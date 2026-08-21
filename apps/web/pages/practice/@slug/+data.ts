import { render } from "vike/abort";
import type { PageContextServer } from "vike/types";
import { getPracticeQuestion } from "@webdev/widgets";

export type Data = {
  slug: string;
  title: string;
  description: string;
};

export function data(pageContext: PageContextServer): Data {
  const slug = pageContext.routeParams.slug;
  const question = getPracticeQuestion(slug);
  if (!question) throw render(404);
  return { slug: question.slug, title: question.title, description: question.description };
}
