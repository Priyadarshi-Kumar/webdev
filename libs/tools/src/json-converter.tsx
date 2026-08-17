import { useMemo, useState } from "react";
import { formatJson, minifyJson, validateJson } from "@webdev/utils";
import { CopyButton, StatusMessage, ToolShell, ToolTextarea, useCopy } from "./components/tool-shell";

const SAMPLE = `{
  "hello": "world",
  "count": 3
}`;

export function JsonConverter() {
  const [input, setInput] = useState(SAMPLE);
  const { copied, copy } = useCopy();
  const validation = useMemo(() => validateJson(input), [input]);

  function apply(result: { ok: true; output: string } | { ok: false; error: string }) {
    if (result.ok) setInput(result.output);
  }

  return (
    <ToolShell
      actions={
        <>
          <button type="button" className="btn-primary min-h-10 px-4 py-2 text-sm" onClick={() => apply(formatJson(input))}>
            Format
          </button>
          <button type="button" className="btn-ghost min-h-10 px-4 py-2 text-sm" onClick={() => apply(minifyJson(input))}>
            Minify
          </button>
          <CopyButton text={input} copied={copied} onCopy={() => void copy(input)} />
        </>
      }
      status={<StatusMessage ok={validation.ok} message={validation.ok ? "Valid JSON" : validation.error} />}
    >
      <ToolTextarea value={input} onChange={setInput} label="JSON" rows={12} />
    </ToolShell>
  );
}
