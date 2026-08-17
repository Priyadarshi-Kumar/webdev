import { useState } from "react";
import {
  decodeBase64,
  decodeHtmlEntities,
  decodeUri,
  encodeBase64,
  encodeHtmlEntities,
  encodeUri,
} from "@webdev/utils";
import { CopyButton, StatusMessage, ToolShell, ToolTextarea, useCopy } from "./components/tool-shell";

function TwoWayTool({
  inputLabel,
  onEncode,
  onDecode,
  encodeLabel = "Encode",
  decodeLabel = "Decode",
}: {
  inputLabel: string;
  onEncode: (text: string) => { ok: true; output: string } | { ok: false; error: string };
  onDecode: (text: string) => { ok: true; output: string } | { ok: false; error: string };
  encodeLabel?: string;
  decodeLabel?: string;
}) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const { copied, copy } = useCopy();

  function run(mode: "encode" | "decode") {
    const result = mode === "encode" ? onEncode(input) : onDecode(input);
    if (result.ok) {
      setOutput(result.output);
      setStatus({ ok: true, message: mode === "encode" ? "Encoded" : "Decoded" });
    } else {
      setStatus({ ok: false, message: result.error });
    }
  }

  return (
    <ToolShell
      actions={
        <>
          <button type="button" className="btn-primary" onClick={() => run("encode")}>
            {encodeLabel}
          </button>
          <button type="button" className="btn-ghost" onClick={() => run("decode")}>
            {decodeLabel}
          </button>
          {output ? <CopyButton text={output} copied={copied} onCopy={() => void copy(output)} /> : null}
        </>
      }
      status={status ? <StatusMessage ok={status.ok} message={status.message} /> : null}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolTextarea value={input} onChange={setInput} label={inputLabel} />
        <ToolTextarea value={output} onChange={setOutput} label="Output" />
      </div>
    </ToolShell>
  );
}

export function Base64Tool() {
  return <TwoWayTool inputLabel="Text or Base64" onEncode={encodeBase64} onDecode={decodeBase64} />;
}

export function UrlEncodeTool() {
  return (
    <TwoWayTool
      inputLabel="Text or percent-encoded value"
      onEncode={encodeUri}
      onDecode={decodeUri}
      encodeLabel="Encode URI"
      decodeLabel="Decode URI"
    />
  );
}

export function HtmlEntitiesTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const { copied, copy } = useCopy();

  function encode() {
    setOutput(encodeHtmlEntities(input));
  }

  function decode() {
    const result = decodeHtmlEntities(input);
    if (result.ok) setOutput(result.output);
    else setOutput(result.error);
  }

  return (
    <ToolShell
      actions={
        <>
          <button type="button" className="btn-primary" onClick={encode}>
            Encode entities
          </button>
          <button type="button" className="btn-ghost" onClick={decode}>
            Decode entities
          </button>
          {output ? <CopyButton text={output} copied={copied} onCopy={() => void copy(output)} /> : null}
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <ToolTextarea value={input} onChange={setInput} label="HTML text" />
        <ToolTextarea value={output} onChange={setOutput} label="Output" />
      </div>
    </ToolShell>
  );
}
