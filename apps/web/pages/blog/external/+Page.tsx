import { BlogWorkspace } from "@webdev/widgets";
import { getAllPosts } from "../../../src/posts";

export default function Page() {
  return <BlogWorkspace posts={getAllPosts()} pane="external" />;
}
