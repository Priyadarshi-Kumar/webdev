import { useState } from "react";
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
  const [output, setOutput] = useState("");
  const { copied, copy } = useCopy();

  return (
    <ToolShell
      actions={
        <>
          {CASES.map((item) => (
            <button
              key={item.label}
              type="button"
              className={item.label === "camelCase" ? "btn-primary" : "btn-ghost"}
              onClick={() => setOutput(item.fn(input))}
            >
              {item.label}
            </button>
          ))}
          {output ? <CopyButton text={output} copied={copied} onCopy={() => void copy(output)} /> : null}
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolTextarea value={input} onChange={setInput} label="Input text" rows={6} />
        <ToolTextarea value={output} onChange={setOutput} label="Output" rows={6} />
      </div>
    </ToolShell>
  );
}
