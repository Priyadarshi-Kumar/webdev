import { useState } from "react";
import { hexToRgb, rgbToHex } from "@webdev/utils";
import { CopyButton, StatusMessage, ToolShell, ToolTextarea, useCopy } from "./components/tool-shell";

export function ColorTool() {
  const [input, setInput] = useState("#3b82f6");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const { copied, copy } = useCopy();

  function run(mode: "hexToRgb" | "rgbToHex") {
    const result = mode === "hexToRgb" ? hexToRgb(input) : rgbToHex(input);
    if (result.ok) {
      setOutput(result.output);
      setStatus({ ok: true, message: "Converted" });
    } else {
      setStatus({ ok: false, message: result.error });
    }
  }

  return (
    <ToolShell
      actions={
        <>
          <button type="button" className="btn-primary" onClick={() => run("hexToRgb")}>
            Hex → RGB
          </button>
          <button type="button" className="btn-ghost" onClick={() => run("rgbToHex")}>
            RGB → Hex
          </button>
          {output ? <CopyButton text={output} copied={copied} onCopy={() => void copy(output)} /> : null}
        </>
      }
      status={status ? <StatusMessage ok={status.ok} message={status.message} /> : null}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolTextarea value={input} onChange={setInput} label="Hex or rgb(...)" rows={4} />
        <div className="space-y-3">
          <div
            className="h-16 rounded-2xl border border-zinc-200 dark:border-white/10"
            style={{ backgroundColor: input.startsWith("#") ? input : undefined }}
          />
          <ToolTextarea value={output} onChange={setOutput} label="Output" rows={3} />
        </div>
      </div>
    </ToolShell>
  );
}
