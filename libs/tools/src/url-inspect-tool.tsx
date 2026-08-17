import { useMemo, useState } from "react";
import { inspectUrl } from "@webdev/utils";
import { CopyButton, StatusMessage, ToolShell, ToolTextarea, useCopy } from "./components/tool-shell";

export function UrlInspectTool() {
  const [input, setInput] = useState("https://user@example.com:8443/path?q=1&lang=en#section");
  const { copied, copy } = useCopy();
  const result = useMemo(() => inspectUrl(input), [input]);
  const output = result.ok ? result.output : "";

  return (
    <ToolShell
      actions={output ? <CopyButton text={output} copied={copied} onCopy={() => void copy(output)} /> : null}
      status={<StatusMessage ok={result.ok} message={result.ok ? "Parsed" : result.error} />}
    >
      <ToolTextarea value={input} onChange={setInput} label="Absolute URL" rows={4} />
      {output ? <pre className="code-panel mt-4 whitespace-pre-wrap">{output}</pre> : null}
    </ToolShell>
  );
}
