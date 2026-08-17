import { useMemo, useState } from "react";
import { parseChmod } from "@webdev/utils";
import { CopyButton, StatusMessage, ToolInput, ToolShell, useCopy } from "./components/tool-shell";

export function ChmodTool() {
  const [input, setInput] = useState("755");
  const { copied, copy } = useCopy();
  const result = useMemo(() => parseChmod(input), [input]);
  const output = result.ok ? result.output : "";

  return (
    <ToolShell
      actions={output ? <CopyButton text={output} copied={copied} onCopy={() => void copy(output)} /> : null}
      status={<StatusMessage ok={result.ok} message={result.ok ? "Converted" : result.error} />}
    >
      <ToolInput value={input} onChange={setInput} label="Octal (755) or symbolic (rwxr-xr-x)" />
      {output ? <pre className="code-panel mt-4 whitespace-pre-wrap">{output}</pre> : null}
    </ToolShell>
  );
}
