import { useData } from "vike-react/useData";
import { ToolsWorkspace } from "@webdev/tools";
import type { Data } from "./+data";

export default function Page() {
  const tool = useData<Data>();
  return <ToolsWorkspace selectedSlug={tool.slug} />;
}
