import { useMemo, useState } from "react";
import { convertNumberBase, type NumberBase } from "@webdev/utils";
import { CopyButton, StatusMessage, ToolInput, ToolShell, useCopy } from "./components/tool-shell";

const BASES: { value: NumberBase; label: string }[] = [
  { value: 10, label: "Decimal" },
  { value: 16, label: "Hex" },
  { value: 8, label: "Octal" },
  { value: 2, label: "Binary" },
];

export function NumberBaseTool() {
  const [input, setInput] = useState("255");
  const [from, setFrom] = useState<NumberBase>(10);
  const { copied, copy } = useCopy();
  const result = useMemo(() => convertNumberBase(input, from), [input, from]);
  const output = result.ok ? result.output : "";

  return (
    <ToolShell
      actions={
        <>
          <select
            value={from}
            onChange={(event) => setFrom(Number(event.target.value) as NumberBase)}
            aria-label="Input base"
            className="tool-input min-h-10 w-auto cursor-pointer py-2"
          >
            {BASES.map((base) => (
              <option key={base.value} value={base.value}>
                From {base.label}
              </option>
            ))}
          </select>
          {output ? <CopyButton text={output} copied={copied} onCopy={() => void copy(output)} /> : null}
        </>
      }
      status={<StatusMessage ok={result.ok} message={result.ok ? "Converted" : result.error} />}
    >
      <ToolInput value={input} onChange={setInput} label="Number (prefixes 0x, 0o, 0b are optional)" />
      {output ? <pre className="code-panel mt-4 whitespace-pre-wrap">{output}</pre> : null}
    </ToolShell>
  );
}
