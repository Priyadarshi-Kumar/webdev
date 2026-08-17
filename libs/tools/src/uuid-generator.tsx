import { useState } from "react";
import { generateUuid } from "@webdev/utils";
import { CopyButton, ToolShell, useCopy } from "./components/tool-shell";

export function UuidGenerator() {
  const [uuids, setUuids] = useState(() => [generateUuid()]);
  const { copied, copy } = useCopy();

  function generate(count: number) {
    setUuids(Array.from({ length: count }, () => generateUuid()));
  }

  const text = uuids.join("\n");

  return (
    <ToolShell
      actions={
        <>
          <button type="button" className="btn-primary" onClick={() => generate(1)}>
            Generate 1
          </button>
          <button type="button" className="btn-ghost" onClick={() => generate(5)}>
            Generate 5
          </button>
          <button type="button" className="btn-ghost" onClick={() => generate(10)}>
            Generate 10
          </button>
          <CopyButton text={text} copied={copied} onCopy={() => void copy(text)} />
        </>
      }
    >
      <pre className="min-h-[8rem] overflow-x-auto rounded-2xl border border-zinc-200 bg-white p-4 font-mono text-sm text-zinc-900 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100">
        {text}
      </pre>
    </ToolShell>
  );
}
