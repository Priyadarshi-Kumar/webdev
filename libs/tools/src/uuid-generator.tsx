import { useState } from "react";
import { generateUuid } from "@webdev/utils";
import { CopyButton, ToolPanel, ToolShell, useCopy } from "./components/tool-shell";

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
          <button type="button" className="btn-primary min-h-10 px-4 py-2 text-sm" onClick={() => generate(1)}>
            Generate 1
          </button>
          <button type="button" className="btn-ghost min-h-10 px-4 py-2 text-sm" onClick={() => generate(5)}>
            Generate 5
          </button>
          <button type="button" className="btn-ghost min-h-10 px-4 py-2 text-sm" onClick={() => generate(10)}>
            Generate 10
          </button>
          <CopyButton text={text} copied={copied} onCopy={() => void copy(text)} />
        </>
      }
    >
      <ToolPanel label={`${uuids.length} UUID${uuids.length === 1 ? "" : "s"}`}>
        <pre className="code-panel min-h-[8rem] overflow-x-auto whitespace-pre">{text}</pre>
      </ToolPanel>
    </ToolShell>
  );
}
