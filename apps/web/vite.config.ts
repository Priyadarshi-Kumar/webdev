import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { rehypeHeadingIds } from "../../libs/utils/src/toc";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import vike from "vike/plugin";
import { defineConfig } from "vite";

const root = path.join(fileURLToPath(new URL(".", import.meta.url)), "../..");

export default defineConfig({
  resolve: {
    alias: [
      { find: "@webdev/widgets/config", replacement: path.join(root, "libs/widgets/src/site/config.ts") },
      { find: "@webdev/widgets/blog-data", replacement: path.join(root, "libs/widgets/src/blog/data.ts") },
      {
        find: "@webdev/widgets/portfolio-data",
        replacement: path.join(root, "libs/widgets/src/portfolio/data.ts"),
      },
      { find: "@webdev/types", replacement: path.join(root, "libs/types/src/index.ts") },
      { find: "@webdev/utils", replacement: path.join(root, "libs/utils/src/index.ts") },
      { find: "@webdev/store", replacement: path.join(root, "libs/store/src/index.ts") },
      { find: "@webdev/components", replacement: path.join(root, "libs/components/src/index.ts") },
      { find: "@webdev/widgets", replacement: path.join(root, "libs/widgets/src/index.ts") },
      { find: "@webdev/tools", replacement: path.join(root, "libs/tools/src/index.ts") },
    ],
  },
  plugins: [
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
        rehypePlugins: [rehypeHeadingIds],
      }),
    },
    vike(),
    react(),
    tailwindcss(),
  ],
});
