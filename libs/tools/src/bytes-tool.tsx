import { useMemo } from "react";
import { useState } from "react";
import { formatBytes, parseByteInput } from "@webdev/utils";
import { CopyButton, StatusMessage, ToolShell, useCopy } from "./components/tool-shell";

export function BytesTool() {
  const [input, setInput] = useState("1048576");
  const { copied, copy } = useCopy();

  const parsed = useMemo(() => parseByteInput(input), [input]);
  const human = useMemo(() => {
    const n = Number(input.trim());
    return Number.isFinite(n) ? formatBytes(n) : "";
  }, [input]);

  const output = parsed.ok ? parsed.output : human ? `${input} bytes\n${human}` : "";

  return (
    <ToolShell
      actions={output ? <CopyButton text={output} copied={copied} onCopy={() => void copy(output)} /> : null}
      status={
        parsed.ok ? (
          <StatusMessage ok message="Converted" />
        ) : input.trim() && human ? (
          <StatusMessage ok message="Human-readable size" />
        ) : input.trim() ? (
          <StatusMessage ok={false} message={parsed.error} />
        ) : null
      }
    >
      <label className="flex flex-col gap-2 text-sm">
        Bytes or size with unit (e.g. 1.5 MB)
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="rounded-2xl border border-zinc-200 bg-white p-3 font-mono text-sm dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </label>
      {output ? (
        <pre className="mt-4 whitespace-pre-wrap rounded-2xl border border-zinc-200 bg-zinc-50 p-4 font-mono text-sm dark:border-white/10 dark:bg-zinc-900/50">
          {output}
        </pre>
      ) : null}
    </ToolShell>
  );
}
