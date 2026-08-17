import { useMemo } from "react";
import { useState } from "react";
import { compareSemver } from "@webdev/utils";
import { StatusMessage, ToolShell } from "./components/tool-shell";

export function SemverTool() {
  const [a, setA] = useState("1.2.3");
  const [b, setB] = useState("1.2.10");
  const result = useMemo(() => compareSemver(a, b), [a, b]);

  return (
    <ToolShell status={<StatusMessage ok={result.ok} message={result.ok ? result.output : result.error} />}>
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Version A
          <input
            value={a}
            onChange={(event) => setA(event.target.value)}
            className="w-40 rounded-xl border border-zinc-200 bg-white px-3 py-2 font-mono dark:border-white/10 dark:bg-zinc-900"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Version B
          <input
            value={b}
            onChange={(event) => setB(event.target.value)}
            className="w-40 rounded-xl border border-zinc-200 bg-white px-3 py-2 font-mono dark:border-white/10 dark:bg-zinc-900"
          />
        </label>
      </div>
    </ToolShell>
  );
}
