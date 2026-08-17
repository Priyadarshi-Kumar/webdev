import { useMemo, useState } from "react";
import { describeCron } from "@webdev/utils";
import { CopyButton, StatusMessage, ToolInput, ToolShell, useCopy } from "./components/tool-shell";

export function CronTool() {
  const [expr, setExpr] = useState("*/15 9-17 * * 1-5");
  const { copied, copy } = useCopy();
  const result = useMemo(() => describeCron(expr), [expr]);
  const output = result.ok ? result.output : "";

  return (
    <ToolShell
      actions={output ? <CopyButton text={output} copied={copied} onCopy={() => void copy(output)} /> : null}
      status={<StatusMessage ok={result.ok} message={result.ok ? "Explained" : result.error} />}
    >
      <ToolInput value={expr} onChange={setExpr} label="Cron expression (5 or 6 fields)" />
      {output ? <pre className="code-panel mt-4 whitespace-pre-wrap">{output}</pre> : null}
    </ToolShell>
  );
}
