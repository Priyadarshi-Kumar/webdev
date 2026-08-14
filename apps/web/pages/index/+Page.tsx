import { HomePage } from "@webdev/widgets";
import { getFeaturedTools } from "@webdev/tools";
import { getLatestPosts, getNotesCount } from "../../src/posts";

export default function Page() {
  return <HomePage posts={getLatestPosts(3)} notesCount={getNotesCount()} tools={getFeaturedTools()} />;
}
