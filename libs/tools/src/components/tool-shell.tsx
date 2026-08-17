import { useState, type ReactNode } from "react";

export const toolTextareaClass =
  "min-h-[12rem] w-full resize-y rounded-2xl border border-zinc-200 bg-white p-3 font-mono text-base leading-6 text-zinc-900 shadow-inner outline-none ring-sky-500/30 focus:ring-2 sm:min-h-[16rem] sm:p-4 sm:text-sm dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100";

export function ToolShell({
  actions,
  status,
  children,
}: {
  actions?: ReactNode;
  status?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-4">
      {actions || status ? (
        <div className="flex flex-wrap items-center gap-2">
          {actions}
          {status ? <span className="ml-auto text-sm font-medium">{status}</span> : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export function ToolTextarea({
  value,
  onChange,
  label,
  rows = 10,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      spellCheck={false}
      aria-label={label}
      rows={rows}
      className={toolTextareaClass}
    />
  );
}

export function useCopy() {
  const [copied, setCopied] = useState(false);

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return { copied, copy };
}

export function StatusMessage({ ok, message }: { ok: boolean; message: string }) {
  return (
    <span className={ok ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"}>
      {message}
    </span>
  );
}

export function CopyButton({ text, copied, onCopy }: { text: string; copied: boolean; onCopy: () => void }) {
  return (
    <button type="button" className="btn-ghost" onClick={() => void onCopy()}>
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
