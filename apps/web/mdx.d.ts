import type { PostFrontmatter } from "@webdev/types";
import type { ComponentType } from "react";

export type { PostFrontmatter };

declare module "*.mdx" {
  export const frontmatter: PostFrontmatter;
  const MDXComponent: ComponentType;
  export default MDXComponent;
}
