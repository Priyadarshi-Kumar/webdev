import { useMemo } from "react";
import { useState } from "react";
import { lineDiff } from "@webdev/utils";
import { CopyButton, ToolShell, ToolTextarea, useCopy } from "./components/tool-shell";

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
      <ToolTextarea value={output} onChange={() => {}} label="Line diff" rows={12} />
    </ToolShell>
  );
}
