import { useMemo, useState } from "react";
import { hexToRgb, rgbToHex } from "@webdev/utils";
import { CopyButton, StatusMessage, ToolPanel, ToolShell, ToolTextarea, useCopy } from "./components/tool-shell";

function pickerHexFrom(input: string): string {
  const fromRgb = rgbToHex(input);
  if (fromRgb.ok) return fromRgb.output;
  const cleaned = input.trim().replace(/^#/, "");
  if (/^[0-9a-f]{6}$/i.test(cleaned)) return `#${cleaned.toLowerCase()}`;
  if (/^[0-9a-f]{3}$/i.test(cleaned)) {
    return `#${cleaned
      .split("")
      .map((char) => char + char)
      .join("")
      .toLowerCase()}`;
  }
  return "#38bdf8";
}

export function ColorTool() {
  const [input, setInput] = useState("#38bdf8");
  const { copied, copy } = useCopy();

  const converted = useMemo(() => {
    const trimmed = input.trim();
    if (trimmed.startsWith("rgb")) return rgbToHex(input);
    return hexToRgb(input);
  }, [input]);

  const pickerHex = pickerHexFrom(input);
  const output = converted.ok ? converted.output : "";

  return (
    <ToolShell
      actions={output ? <CopyButton text={output} copied={copied} onCopy={() => void copy(output)} /> : null}
      status={
        converted.ok ? (
          <StatusMessage ok message="Live conversion" />
        ) : input.trim() ? (
          <StatusMessage ok={false} message={converted.error} />
        ) : null
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolTextarea value={input} onChange={setInput} label="Hex or rgb(...)" rows={4} />
        <div className="space-y-3">
          <ToolPanel label="Preview">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={pickerHex}
                aria-label="Color picker"
                onChange={(event) => setInput(event.target.value)}
                className="h-16 w-16 cursor-pointer rounded-2xl border border-zinc-200 bg-transparent p-1 dark:border-white/10"
              />
              <div
                className="h-16 flex-1 rounded-2xl border border-zinc-200/80 shadow-inner dark:border-white/10"
                style={{ backgroundColor: pickerHex }}
              />
            </div>
          </ToolPanel>
          <ToolTextarea value={output} label="Output" rows={3} readOnly />
        </div>
      </div>
    </ToolShell>
  );
}
