import { useMemo, useState } from "react";
import { lineDiff } from "@webdev/utils";
import { CopyButton, ToolPanel, ToolShell, ToolTextarea, useCopy } from "./components/tool-shell";

const LEFT = `function greet(name) {
  return "hi " + name;
}`;

const RIGHT = `function greet(name) {
  return \`Hello, \${name}!\`;
}`;

export function DiffTool() {
  const [left, setLeft] = useState(LEFT);
  const [right, setRight] = useState(RIGHT);
  const output = useMemo(() => lineDiff(left, right), [left, right]);
  const { copied, copy } = useCopy();

  return (
    <ToolShell actions={<CopyButton text={output} copied={copied} onCopy={() => void copy(output)} />}>
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolTextarea value={left} onChange={setLeft} label="Original" />
        <ToolTextarea value={right} onChange={setRight} label="Changed" />
      </div>
      <ToolPanel label="Line diff">
        <pre className="code-panel max-h-[28rem] overflow-auto whitespace-pre">
          {output.split("\n").map((line, index) => (
            <div
              key={`${index}-${line}`}
              className={
                line.startsWith("+ ")
                  ? "bg-emerald-400/10 text-emerald-200"
                  : line.startsWith("- ")
                    ? "bg-rose-400/10 text-rose-200"
                    : "text-zinc-300"
              }
            >
              {line || " "}
            </div>
          ))}
        </pre>
      </ToolPanel>
    </ToolShell>
  );
}
