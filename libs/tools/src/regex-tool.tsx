import { useMemo } from "react";
import { useState } from "react";
import { testRegex } from "@webdev/utils";
import { StatusMessage, ToolShell, ToolTextarea } from "./components/tool-shell";

export function RegexTool() {
  const [pattern, setPattern] = useState("\\w+");
  const [flags, setFlags] = useState("g");
  const [sample, setSample] = useState("hello world 123");

  const result = useMemo(() => testRegex(pattern, flags, sample), [pattern, flags, sample]);

  return (
    <ToolShell status={<StatusMessage ok={result.ok} message={result.ok ? "Results" : result.error} />}>
      <div className="grid gap-4">
        <div className="flex flex-wrap gap-3">
          <label className="flex flex-1 min-w-[12rem] flex-col gap-1 text-sm">
            Pattern
            <input
              value={pattern}
              onChange={(event) => setPattern(event.target.value)}
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2 font-mono dark:border-white/10 dark:bg-zinc-900"
            />
          </label>
          <label className="flex w-24 flex-col gap-1 text-sm">
            Flags
            <input
              value={flags}
              onChange={(event) => setFlags(event.target.value)}
              className="rounded-xl border border-zinc-200 bg-white px-3 py-2 font-mono dark:border-white/10 dark:bg-zinc-900"
            />
          </label>
        </div>
        <ToolTextarea value={sample} onChange={setSample} label="Sample text" rows={5} />
        <ToolTextarea
          value={result.ok ? result.output : ""}
          onChange={() => {}}
          label="Matches"
          rows={5}
        />
      </div>
    </ToolShell>
  );
}
