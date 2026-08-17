import { useMemo, useState } from "react";
import { lookupHttpStatus } from "@webdev/utils";
import { ToolInput, ToolShell } from "./components/tool-shell";

export function HttpStatusTool() {
  const [query, setQuery] = useState("");
  const matches = useMemo(() => lookupHttpStatus(query), [query]);

  return (
    <ToolShell>
      <ToolInput value={query} onChange={setQuery} label="Filter by code, name, or group" />
      <ul className="mt-4 divide-y divide-zinc-200/80 overflow-hidden rounded-2xl border border-zinc-200/80 dark:divide-white/10 dark:border-white/10">
        {matches.length === 0 ? (
          <li className="px-4 py-6 text-sm text-zinc-500">No status codes match that filter.</li>
        ) : (
          matches.map((item) => (
            <li key={item.code} className="flex items-baseline justify-between gap-3 px-4 py-3">
              <div>
                <p className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {item.code} {item.name}
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">{item.group}</p>
              </div>
            </li>
          ))
        )}
      </ul>
    </ToolShell>
  );
}
