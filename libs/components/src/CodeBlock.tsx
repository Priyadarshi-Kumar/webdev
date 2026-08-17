import { Check, Copy } from "lucide-react";
import { isValidElement, useRef, useState, type ComponentProps, type ReactNode } from "react";

function languageFromChildren(children: ReactNode) {
  const child = Array.isArray(children) ? children[0] : children;
  if (!isValidElement(child)) return "text";
  const props = child.props as { "data-language"?: string; className?: string };
  const fromData = props["data-language"];
  if (fromData) return fromData;
  const match = /language-([\w-]+)/.exec(props.className ?? "");
  return match?.[1] ?? "text";
}

export function CodeBlock({ children, className = "", ...props }: ComponentProps<"pre">) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const language = languageFromChildren(children);

  async function copy() {
    const text = preRef.current?.innerText ?? "";
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="code-block">
      <div className="code-block-bar">
        <span className="code-block-lang">{language}</span>
        <button type="button" className="code-block-copy" onClick={() => void copy()}>
          {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre ref={preRef} className={className} {...props}>
        {children}
      </pre>
    </div>
  );
}
