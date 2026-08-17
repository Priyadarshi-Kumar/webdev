import { useState } from "react";
import { generatePassword } from "@webdev/utils";
import { CopyButton, ToolShell, useCopy } from "./components/tool-shell";

export function PasswordTool() {
  const [length, setLength] = useState(16);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState(() => generatePassword(16, true));
  const { copied, copy } = useCopy();

  function regenerate() {
    setPassword(generatePassword(length, symbols));
  }

  return (
    <ToolShell
      actions={
        <>
          <button type="button" className="btn-primary" onClick={regenerate}>
            Generate
          </button>
          <CopyButton text={password} copied={copied} onCopy={() => void copy(password)} />
        </>
      }
    >
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Length
          <input
            type="number"
            min={8}
            max={128}
            value={length}
            onChange={(event) => setLength(Number(event.target.value))}
            className="w-24 rounded-xl border border-zinc-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-zinc-900"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={symbols} onChange={(event) => setSymbols(event.target.checked)} />
          Include symbols
        </label>
      </div>
      <input
        readOnly
        value={password}
        aria-label="Generated password"
        className="mt-4 w-full rounded-2xl border border-zinc-200 bg-white p-4 font-mono text-lg tracking-wide text-zinc-900 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"
      />
    </ToolShell>
  );
}
