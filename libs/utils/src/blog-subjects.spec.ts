import { describe, expect, it } from "vitest";
import { groupPostsBySubject, resolveSubject } from "./blog-subjects";

describe("resolveSubject", () => {
  it("maps react tags to react", () => {
    expect(resolveSubject(["react", "hooks", "javascript"])).toBe("react");
  });

  it("maps browser tags to browser", () => {
    expect(resolveSubject(["browser", "web-apis", "javascript"])).toBe("browser");
  });

  it("maps mcp tags to mcp", () => {
    expect(resolveSubject(["mcp", "ai", "javascript"])).toBe("mcp");
  });

  it("maps nx tags to nx", () => {
    expect(resolveSubject(["nx", "monorepo", "javascript"])).toBe("nx");
  });

  it("maps package manager tags to packages", () => {
    expect(resolveSubject(["javascript", "tooling", "pnpm", "npm", "yarn"])).toBe("packages");
  });

  it("falls back to tooling", () => {
    expect(resolveSubject(["interview"])).toBe("tooling");
  });
});

describe("groupPostsBySubject", () => {
  it("groups posts and preserves subject order", () => {
    const groups = groupPostsBySubject([
      { slug: "a", tags: ["nx"], title: "", description: "", date: "" },
      { slug: "b", tags: ["react"], title: "", description: "", date: "" },
      { slug: "c", tags: ["mcp", "ai"], title: "", description: "", date: "" },
    ]);

    expect(groups.map((group) => group.id)).toEqual(["react", "mcp", "nx"]);
    expect(groups[0]?.posts.map((post) => post.slug)).toEqual(["b"]);
  });
});
