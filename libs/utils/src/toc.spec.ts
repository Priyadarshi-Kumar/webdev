import { describe, expect, it } from "vitest";
import { extractToc, slugifyHeading, uniqueHeadingId } from "./toc";

describe("toc", () => {
  it("nests h3 under the previous h2 and skips fenced code", () => {
    const toc = extractToc(`---
title: Demo
description: x
slug: demo
date: 2026-08-14
tags:
  - react
---

Intro.

## React 19

### \`useEffectEvent\`

\`\`\`bash
# not a heading
## still not
\`\`\`

### \`use\`

## Interview questions
`);

    expect(toc).toEqual([
      {
        id: "react-19",
        text: "React 19",
        children: [
          { id: "useeffectevent", text: "useEffectEvent", children: [] },
          { id: "use", text: "use", children: [] },
        ],
      },
      { id: "interview-questions", text: "Interview questions", children: [] },
    ]);
  });

  it("returns no entries when the source is not a string", () => {
    expect(extractToc(undefined as unknown as string)).toEqual([]);
  });

  it("suffixes duplicate headings", () => {
    const used = new Map<string, number>();
    expect(uniqueHeadingId("Hello", used)).toBe("hello");
    expect(uniqueHeadingId("Hello", used)).toBe("hello-1");
    expect(slugifyHeading("How `node_modules` is built (this is the real difference)")).toBe(
      "how-node_modules-is-built-this-is-the-real-difference",
    );
  });
});
