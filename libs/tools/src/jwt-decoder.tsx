import { useMemo } from "react";
import { useState } from "react";
import { decodeJwt } from "@webdev/utils";
import { CopyButton, StatusMessage, ToolShell, ToolTextarea, useCopy } from "./components/tool-shell";

const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export function JwtDecoder() {
  const [input, setInput] = useState(SAMPLE);
  const { copied, copy } = useCopy();
  const result = useMemo(() => decodeJwt(input), [input]);

  return (
    <ToolShell
      actions={
        result.ok ? <CopyButton text={result.output} copied={copied} onCopy={() => void copy(result.output)} /> : null
      }
      status={
        <StatusMessage
          ok={result.ok}
          message={result.ok ? "Decoded (signature not verified)" : result.error}
        />
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolTextarea value={input} onChange={setInput} label="JWT token" rows={8} />
        <ToolTextarea
          value={result.ok ? result.output : ""}
          onChange={() => {}}
          label="Decoded JSON"
          rows={8}
        />
      </div>
    </ToolShell>
  );
}
