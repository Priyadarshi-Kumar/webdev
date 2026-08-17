import { useEffect, useState } from "react";
import { hashText } from "@webdev/utils";
import { CopyButton, ToolShell, ToolTextarea, useCopy } from "./components/tool-shell";

export function HashTool() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<"SHA-256" | "SHA-1">("SHA-256");
  const [hash, setHash] = useState("");
  const { copied, copy } = useCopy();

  useEffect(() => {
    let cancelled = false;
    void hashText(input, algorithm).then((value) => {
      if (!cancelled) setHash(value);
    });
    return () => {
      cancelled = true;
    };
  }, [input, algorithm]);

  return (
    <ToolShell
      actions={
        <>
          <select
            value={algorithm}
            onChange={(event) => setAlgorithm(event.target.value as "SHA-256" | "SHA-1")}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-zinc-900"
          >
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-1">SHA-1</option>
          </select>
          {hash ? <CopyButton text={hash} copied={copied} onCopy={() => void copy(hash)} /> : null}
        </>
      }
    >
      <div className="space-y-4">
        <ToolTextarea value={input} onChange={setInput} label="Text to hash" rows={6} />
        <input
          readOnly
          value={hash}
          aria-label="Hash output"
          className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 p-3 font-mono text-sm text-zinc-900 dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-100"
        />
      </div>
    </ToolShell>
  );
}
