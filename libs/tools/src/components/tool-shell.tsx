import { Check, Copy } from "lucide-react";
import { useState, type ReactNode } from "react";

export const toolTextareaClass =
  "tool-input min-h-[12rem] resize-y leading-6 sm:min-h-[16rem]";

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
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-zinc-200/80 bg-zinc-50/80 p-2 dark:border-white/10 dark:bg-zinc-950/40">
          {actions}
          {status ? <span className="ml-auto px-1 text-sm font-medium">{status}</span> : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export function ToolPanel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-0 flex-col gap-1.5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {children}
    </div>
  );
}

export function ToolTextarea({
  value,
  onChange,
  label,
  rows = 10,
  readOnly = false,
}: {
  value: string;
  onChange?: (value: string) => void;
  label: string;
  rows?: number;
  readOnly?: boolean;
}) {
  return (
    <ToolPanel label={label}>
      <textarea
        value={value}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        readOnly={readOnly || !onChange}
        spellCheck={false}
        aria-label={label}
        rows={rows}
        className={toolTextareaClass}
      />
    </ToolPanel>
  );
}

export function ToolInput({
  value,
  onChange,
  label,
  type = "text",
  min,
  max,
  readOnly = false,
  className = "",
}: {
  value: string | number;
  onChange?: (value: string) => void;
  label: string;
  type?: "text" | "number";
  min?: number;
  max?: number;
  readOnly?: boolean;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 ${className}`}>
      {label}
      <input
        type={type}
        min={min}
        max={max}
        value={value}
        readOnly={readOnly}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        className="tool-input"
      />
    </label>
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
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        ok
          ? "bg-emerald-400/15 text-emerald-700 dark:text-emerald-300"
          : "bg-rose-400/15 text-rose-700 dark:text-rose-300"
      }`}
    >
      {message}
    </span>
  );
}

export function CopyButton({
  text,
  copied,
  onCopy,
  compact = false,
}: {
  text: string;
  copied: boolean;
  onCopy: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={!text}
      onClick={() => void onCopy()}
      className={`${
        compact
          ? "btn-ghost min-h-8 gap-1 px-2.5 py-1 text-xs"
          : "btn-ghost min-h-10 gap-1.5 px-4 py-2 text-sm"
      } disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
