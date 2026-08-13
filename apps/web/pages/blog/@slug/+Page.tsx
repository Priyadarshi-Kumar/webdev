import { BlogPost } from "@webdev/widgets";
import { useData } from "vike-react/useData";
import { getPost } from "../../../src/posts";
import type { Data } from "./+data";

export default function Page() {
  const meta = useData<Data>();
  const post = getPost(meta.slug);
  if (!post) return null;
  return <BlogPost post={{ ...post, toc: meta.toc }} Content={post.Component} />;
}
