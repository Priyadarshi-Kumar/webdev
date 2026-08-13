import { useData } from "vike-react/useData";
import type { ComponentType } from "react";
import { Eyebrow } from "@webdev/components";
import { JsonConverter } from "@webdev/tools";
import type { Data } from "./+data";

const toolUi: Record<string, ComponentType> = {
  json: JsonConverter,
};

export default function Page() {
  const tool = useData<Data>();
  const ToolUi = toolUi[tool.slug];

  return (
    <section>
      <Eyebrow>Tools</Eyebrow>
      <h1 className="page-title">{tool.title}</h1>
      <p className="page-lead">{tool.description}</p>
      <div className="mt-8">
        {ToolUi ? <ToolUi /> : <p className="text-zinc-500">This tool is not wired up yet.</p>}
      </div>
    </section>
  );
}
