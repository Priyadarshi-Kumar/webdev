import { useMemo, useState } from "react";
import {
  toCamelCase,
  toConstantCase,
  toKebabCase,
  toPascalCase,
  toSnakeCase,
} from "@webdev/utils";
import { CopyButton, ToolShell, ToolTextarea, useCopy } from "./components/tool-shell";

const CASES = [
  { label: "camelCase", fn: toCamelCase },
  { label: "PascalCase", fn: toPascalCase },
  { label: "snake_case", fn: toSnakeCase },
  { label: "kebab-case", fn: toKebabCase },
  { label: "CONSTANT_CASE", fn: toConstantCase },
] as const;

export function CaseTool() {
  const [input, setInput] = useState("hello world example");
  const { copied, copy } = useCopy();
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  const outputs = useMemo(
    () => CASES.map((item) => ({ label: item.label, value: item.fn(input) })),
    [input],
  );

  return (
    <ToolShell>
      <ToolTextarea value={input} onChange={setInput} label="Input text" rows={4} />
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {outputs.map((item) => (
          <li
            key={item.label}
            className="rounded-2xl border border-zinc-200/80 bg-zinc-50/80 p-4 dark:border-white/10 dark:bg-zinc-950/40"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">{item.label}</p>
              <CopyButton
                compact
                text={item.value}
                copied={copied && copiedLabel === item.label}
                onCopy={() => {
                  setCopiedLabel(item.label);
                  void copy(item.value);
                }}
              />
            </div>
            <p className="mt-2 break-all font-mono text-sm text-zinc-900 dark:text-zinc-100">{item.value}</p>
          </li>
        ))}
      </ul>
    </ToolShell>
  );
}
