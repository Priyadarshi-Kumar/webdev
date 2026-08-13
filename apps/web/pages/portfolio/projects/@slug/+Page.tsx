import { ProjectPage } from "@webdev/widgets";
import { useData } from "vike-react/useData";
import type { Data } from "./+data";

export default function Page() {
  return <ProjectPage project={useData<Data>()} />;
}
