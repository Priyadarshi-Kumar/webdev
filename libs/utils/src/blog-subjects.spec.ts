import { describe, expect, it } from "vitest";
import { groupPostsBySubject, resolveSubject } from "./blog-subjects";

describe("resolveSubject", () => {
  it("maps react tags to react", () => {
    expect(resolveSubject(["react", "hooks", "javascript"])).toBe("react");
  });

  it("maps browser tags to browser", () => {
    expect(resolveSubject(["browser", "web-apis", "javascript"])).toBe("browser");
  });

  it("maps llm tags to llm", () => {
    expect(resolveSubject(["llm", "mcp", "ai", "javascript"])).toBe("llm");
  });

  it("maps mcp tags to llm", () => {
    expect(resolveSubject(["mcp", "ai", "javascript"])).toBe("llm");
  });

  it("maps nx tags to nx", () => {
    expect(resolveSubject(["nx", "monorepo", "javascript"])).toBe("nx");
  });

  it("maps package manager tags to packages", () => {
    expect(resolveSubject(["javascript", "tooling", "pnpm", "npm", "yarn"])).toBe("packages");
  });

  it("maps python and fastapi tags to backend", () => {
    expect(resolveSubject(["python", "fastapi", "api", "interview"])).toBe("backend");
  });

  it("maps database tags to backend", () => {
    expect(resolveSubject(["database", "sql", "interview"])).toBe("backend");
  });

  it("maps javascript-only tags to javascript", () => {
    expect(resolveSubject(["javascript"])).toBe("javascript");
  });

  it("keeps tooling posts in tooling even when they also have javascript", () => {
    expect(resolveSubject(["javascript", "jest", "tooling", "interview"])).toBe("tooling");
  });

  it("lets an explicit subject win over tags", () => {
    expect(resolveSubject(["browser", "web-apis", "javascript"], "javascript")).toBe("javascript");
  });

  it("ignores an unknown explicit subject", () => {
    expect(resolveSubject(["react"], "not-a-bucket")).toBe("react");
  });
});

describe("groupPostsBySubject", () => {
  it("groups posts and preserves subject order", () => {
    const groups = groupPostsBySubject([
      { slug: "a", tags: ["nx"], title: "", description: "", date: "" },
      { slug: "b", tags: ["react"], title: "", description: "", date: "" },
      { slug: "c", tags: ["mcp", "ai"], title: "", description: "", date: "" },
      { slug: "d", tags: ["javascript"], title: "", description: "", date: "" },
      { slug: "e", tags: ["browser", "javascript"], title: "", description: "", date: "", subject: "javascript" },
    ]);

    expect(groups.map((group) => group.id)).toEqual(["react", "javascript", "llm", "nx"]);
    expect(groups[0]?.posts.map((post) => post.slug)).toEqual(["b"]);
    expect(groups.find((group) => group.id === "javascript")?.posts.map((post) => post.slug)).toEqual(["d", "e"]);
  });
});
