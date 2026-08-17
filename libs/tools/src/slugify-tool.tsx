import { useMemo, useState } from "react";
import { slugify } from "@webdev/utils";
import { CopyButton, ToolShell, ToolTextarea, useCopy } from "./components/tool-shell";

export function SlugifyTool() {
  const [input, setInput] = useState("Hello World — A Great Post!");
  const output = useMemo(() => slugify(input), [input]);
  const { copied, copy } = useCopy();

  return (
    <ToolShell actions={<CopyButton text={output} copied={copied} onCopy={() => void copy(output)} />}>
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolTextarea value={input} onChange={setInput} label="Title or phrase" rows={6} />
        <ToolTextarea value={output} label="URL slug" rows={6} readOnly />
      </div>
    </ToolShell>
  );
}
