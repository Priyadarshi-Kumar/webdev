import { useMemo, useState } from "react";
import { formatBytes, parseByteInput } from "@webdev/utils";
import { CopyButton, StatusMessage, ToolInput, ToolShell, useCopy } from "./components/tool-shell";

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
      <ToolInput value={input} onChange={setInput} label="Bytes or size with unit (e.g. 1.5 MB)" />
      {output ? <pre className="code-panel mt-4 whitespace-pre-wrap">{output}</pre> : null}
    </ToolShell>
  );
}
