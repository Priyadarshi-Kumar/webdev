import { useMemo, useState } from "react";
import { compareSemver } from "@webdev/utils";
import { StatusMessage, ToolInput, ToolShell } from "./components/tool-shell";

export function SemverTool() {
  const [a, setA] = useState("1.2.3");
  const [b, setB] = useState("1.2.10");
  const result = useMemo(() => compareSemver(a, b), [a, b]);

  return (
    <ToolShell status={<StatusMessage ok={result.ok} message={result.ok ? result.output : result.error} />}>
      <div className="grid gap-4 sm:grid-cols-2">
        <ToolInput value={a} onChange={setA} label="Version A" />
        <ToolInput value={b} onChange={setB} label="Version B" />
      </div>
      {result.ok ? (
        <div className="mt-4 rounded-2xl border border-sky-400/25 bg-gradient-to-br from-sky-400/15 via-transparent to-violet-400/15 px-5 py-6 text-center">
          <p className="font-display text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            {result.output}
          </p>
        </div>
      ) : null}
    </ToolShell>
  );
}
