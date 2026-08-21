import { practiceQuestions } from "@webdev/widgets";

export async function onBeforePrerenderStart() {
  return practiceQuestions.map((question) => `/practice/${question.slug}`);
}
