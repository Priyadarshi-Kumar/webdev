import { HomePage } from "@webdev/widgets";
import { getLatestPosts, getNotesCount } from "../../src/posts";

export default function Page() {
  return <HomePage posts={getLatestPosts(3)} notesCount={getNotesCount()} />;
}
