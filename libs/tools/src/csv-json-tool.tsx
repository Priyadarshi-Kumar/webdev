import { useState } from "react";
import { csvToJson, jsonToCsv } from "@webdev/utils";
import { CopyButton, StatusMessage, ToolShell, ToolTextarea, useCopy } from "./components/tool-shell";

const SAMPLE_CSV = `name,role
Ada,Engineer
Grace,Scientist`;

const SAMPLE_JSON = `[
  { "name": "Ada", "role": "Engineer" },
  { "name": "Grace", "role": "Scientist" }
]`;

export function CsvJsonTool() {
  const [input, setInput] = useState(SAMPLE_CSV);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const { copied, copy } = useCopy();

  function run(mode: "csvToJson" | "jsonToCsv") {
    const result = mode === "csvToJson" ? csvToJson(input) : jsonToCsv(input);
    if (result.ok) {
      setOutput(result.output);
      setStatus({ ok: true, message: mode === "csvToJson" ? "CSV → JSON" : "JSON → CSV" });
    } else {
      setStatus({ ok: false, message: result.error });
    }
  }

  return (
    <ToolShell
      actions={
        <>
          <button type="button" className="btn-primary" onClick={() => run("csvToJson")}>
            CSV → JSON
          </button>
          <button type="button" className="btn-ghost" onClick={() => run("jsonToCsv")}>
            JSON → CSV
          </button>
          <button type="button" className="btn-ghost" onClick={() => setInput(SAMPLE_CSV)}>
            Sample CSV
          </button>
          <button type="button" className="btn-ghost" onClick={() => setInput(SAMPLE_JSON)}>
            Sample JSON
          </button>
          {output ? <CopyButton text={output} copied={copied} onCopy={() => void copy(output)} /> : null}
        </>
      }
      status={status ? <StatusMessage ok={status.ok} message={status.message} /> : null}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolTextarea value={input} onChange={setInput} label="CSV or JSON" />
        <ToolTextarea value={output} onChange={setOutput} label="Output" />
      </div>
    </ToolShell>
  );
}
