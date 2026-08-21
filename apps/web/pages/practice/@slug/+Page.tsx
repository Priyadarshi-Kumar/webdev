import { useData } from "vike-react/useData";
import { PracticeWorkspace } from "@webdev/widgets";
import type { Data } from "./+data";

export default function Page() {
  const question = useData<Data>();
  return <PracticeWorkspace selectedSlug={question.slug} />;
}
