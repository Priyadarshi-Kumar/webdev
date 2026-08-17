import { useEffect, useState } from "react";
import { hashText } from "@webdev/utils";
import { CopyButton, ToolInput, ToolShell, ToolTextarea, useCopy } from "./components/tool-shell";

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
            aria-label="Hash algorithm"
            className="tool-input min-h-10 w-auto cursor-pointer py-2"
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
        <ToolInput value={hash} label={`${algorithm} digest`} readOnly />
      </div>
    </ToolShell>
  );
}
