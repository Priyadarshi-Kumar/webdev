import { BlogPost } from "@webdev/widgets";
import { useData } from "vike-react/useData";
import { getAllPosts } from "../../../src/posts";
import type { Data } from "./+data";

export default function Page() {
  const meta = useData<Data>();
  return <BlogPost posts={getAllPosts()} selectedSlug={meta.slug} toc={meta.toc} />;
}
