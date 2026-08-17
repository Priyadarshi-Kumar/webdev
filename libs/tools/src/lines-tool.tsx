import { useMemo, useState } from "react";
import { transformLines, type LineMode } from "@webdev/utils";
import { CopyButton, StatusMessage, ToolShell, ToolTextarea, useCopy } from "./components/tool-shell";

const MODES: { value: LineMode; label: string }[] = [
  { value: "sort", label: "Sort" },
  { value: "unique", label: "Unique" },
  { value: "reverse", label: "Reverse" },
  { value: "trim", label: "Trim empty" },
  { value: "stats", label: "Stats" },
];

export function LinesTool() {
  const [input, setInput] = useState("banana\napple\nbanana\n\ncherry");
  const [mode, setMode] = useState<LineMode>("sort");
  const { copied, copy } = useCopy();
  const result = useMemo(() => transformLines(input, mode), [input, mode]);
  const output = result.ok ? result.output : "";

  return (
    <ToolShell
      actions={
        <>
          {MODES.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={mode === item.value}
              className={
                mode === item.value ? "btn-primary min-h-10 px-4 py-2 text-sm" : "btn-ghost min-h-10 px-4 py-2 text-sm"
              }
              onClick={() => setMode(item.value)}
            >
              {item.label}
            </button>
          ))}
          {output ? <CopyButton text={output} copied={copied} onCopy={() => void copy(output)} /> : null}
        </>
      }
      status={<StatusMessage ok message={MODES.find((item) => item.value === mode)?.label ?? mode} />}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolTextarea value={input} onChange={setInput} label="Lines" rows={10} />
        <ToolTextarea value={output} label="Output" rows={10} readOnly />
      </div>
    </ToolShell>
  );
}
