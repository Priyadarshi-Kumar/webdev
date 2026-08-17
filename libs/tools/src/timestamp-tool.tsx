import { useState } from "react";
import { dateToUnix, unixToDate } from "@webdev/utils";
import { CopyButton, StatusMessage, ToolShell, ToolTextarea, useCopy } from "./components/tool-shell";

export function TimestampTool() {
  const [input, setInput] = useState(String(Math.floor(Date.now() / 1000)));
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const { copied, copy } = useCopy();

  function run(mode: "toDate" | "toUnix") {
    const result = mode === "toDate" ? unixToDate(input) : dateToUnix(input);
    if (result.ok) {
      setOutput(result.output);
      setStatus({ ok: true, message: mode === "toDate" ? "Converted to date" : "Converted to Unix" });
    } else {
      setStatus({ ok: false, message: result.error });
    }
  }

  return (
    <ToolShell
      actions={
        <>
          <button type="button" className="btn-primary" onClick={() => run("toDate")}>
            Unix → date
          </button>
          <button type="button" className="btn-ghost" onClick={() => run("toUnix")}>
            Date → Unix
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setInput(String(Math.floor(Date.now() / 1000)))}
          >
            Now
          </button>
          {output ? <CopyButton text={output} copied={copied} onCopy={() => void copy(output)} /> : null}
        </>
      }
      status={status ? <StatusMessage ok={status.ok} message={status.message} /> : null}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolTextarea value={input} onChange={setInput} label="Unix timestamp or date string" rows={6} />
        <ToolTextarea value={output} onChange={setOutput} label="Output" rows={6} />
      </div>
    </ToolShell>
  );
}
