import { BlogIndex } from "@webdev/widgets";
import { getAllPosts } from "../../src/posts";

export default function Page() {
  return <BlogIndex posts={getAllPosts()} />;
}
