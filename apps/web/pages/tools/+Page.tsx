import { ToolsWorkspace, tools } from "@webdev/tools";

export default function Page() {
  return <ToolsWorkspace selectedSlug={tools[0]?.slug} />;
}
