import { useMemo, useState } from "react";
import { testRegex } from "@webdev/utils";
import { StatusMessage, ToolInput, ToolShell, ToolTextarea } from "./components/tool-shell";

export function RegexTool() {
  const [pattern, setPattern] = useState("\\w+");
  const [flags, setFlags] = useState("g");
  const [sample, setSample] = useState("hello world 123");

  const result = useMemo(() => testRegex(pattern, flags, sample), [pattern, flags, sample]);

  return (
    <ToolShell status={<StatusMessage ok={result.ok} message={result.ok ? "Results" : result.error} />}>
      <div className="grid gap-4">
        <div className="flex flex-wrap gap-3">
          <ToolInput value={pattern} onChange={setPattern} label="Pattern" className="min-w-[12rem] flex-1" />
          <ToolInput value={flags} onChange={setFlags} label="Flags" className="w-24" />
        </div>
        <ToolTextarea value={sample} onChange={setSample} label="Sample text" rows={5} />
        <ToolTextarea value={result.ok ? result.output : ""} label="Matches" rows={5} readOnly />
      </div>
    </ToolShell>
  );
}
