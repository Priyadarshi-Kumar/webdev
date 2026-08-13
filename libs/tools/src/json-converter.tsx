import { useMemo, useState } from "react";
import { formatJson, minifyJson, validateJson } from "@webdev/utils";

const SAMPLE = `{
  "hello": "world",
  "count": 3
}`;

export function JsonConverter() {
  const [input, setInput] = useState(SAMPLE);
  const [copied, setCopied] = useState(false);

  const validation = useMemo(() => validateJson(input), [input]);

  function apply(result: { ok: true; output: string } | { ok: false; error: string }) {
    if (result.ok) setInput(result.output);
  }

  async function copy() {
    await navigator.clipboard.writeText(input);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="btn-primary" onClick={() => apply(formatJson(input))}>
          Format
        </button>
        <button type="button" className="btn-ghost" onClick={() => apply(minifyJson(input))}>
          Minify
        </button>
        <button type="button" className="btn-ghost" onClick={copy}>
          {copied ? "Copied" : "Copy"}
        </button>
        <span
          className={`ml-auto text-sm font-medium ${validation.ok ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"}`}
        >
          {validation.ok ? "Valid JSON" : validation.error}
        </span>
      </div>
      <textarea
        value={input}
        onChange={(event) => setInput(event.target.value)}
        spellCheck={false}
        aria-label="JSON input"
        className="min-h-[16rem] w-full resize-y rounded-2xl border border-zinc-200 bg-white p-3 font-mono text-base leading-6 text-zinc-900 shadow-inner outline-none ring-sky-500/30 focus:ring-2 sm:min-h-[28rem] sm:p-4 sm:text-sm dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"
      />
    </div>
  );
}
