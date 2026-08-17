import { useData } from "vike-react/useData";
import { Eyebrow } from "@webdev/components";
import { toolUi } from "@webdev/tools";
import type { Data } from "./+data";

export default function Page() {
  const tool = useData<Data>();
  const ToolUi = toolUi[tool.slug];

  return (
    <article itemScope itemType="https://schema.org/WebApplication">
      <Eyebrow>Tools</Eyebrow>
      <h1 className="page-title" itemProp="name">
        {tool.title}
      </h1>
      <p className="page-lead" itemProp="description">
        {tool.description}
      </p>
      <div className="mt-8">
        {ToolUi ? <ToolUi /> : <p className="text-zinc-500">This tool is not wired up yet.</p>}
      </div>
    </article>
  );
}
