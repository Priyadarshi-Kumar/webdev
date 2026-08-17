import { useState } from "react";
import { generatePassword } from "@webdev/utils";
import { CopyButton, ToolPanel, ToolShell, useCopy } from "./components/tool-shell";

export function PasswordTool() {
  const [length, setLength] = useState(16);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState(() => generatePassword(16, true));
  const { copied, copy } = useCopy();

  function regenerate(nextLength = length, nextSymbols = symbols) {
    setPassword(generatePassword(nextLength, nextSymbols));
  }

  return (
    <ToolShell
      actions={
        <>
          <button type="button" className="btn-primary min-h-10 px-4 py-2 text-sm" onClick={() => regenerate()}>
            Generate
          </button>
          <button
            type="button"
            aria-pressed={symbols}
            className={symbols ? "btn-primary min-h-10 px-4 py-2 text-sm" : "btn-ghost min-h-10 px-4 py-2 text-sm"}
            onClick={() => {
              const next = !symbols;
              setSymbols(next);
              regenerate(length, next);
            }}
          >
            Symbols {symbols ? "on" : "off"}
          </button>
          <CopyButton text={password} copied={copied} onCopy={() => void copy(password)} />
        </>
      }
    >
      <ToolPanel label={`Length · ${length}`}>
        <input
          type="range"
          min={8}
          max={128}
          value={length}
          aria-label="Password length"
          onChange={(event) => {
            const next = Number(event.target.value);
            setLength(next);
            regenerate(next, symbols);
          }}
          className="w-full accent-sky-400"
        />
      </ToolPanel>
      <input
        readOnly
        value={password}
        aria-label="Generated password"
        className="tool-input mt-4 p-4 text-lg tracking-wide"
      />
    </ToolShell>
  );
}
