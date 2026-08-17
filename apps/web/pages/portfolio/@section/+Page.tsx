import { PortfolioPage } from "@webdev/widgets";
import { useData } from "vike-react/useData";
import type { Data } from "./+data";

export default function Page() {
  const { section } = useData<Data>();
  return <PortfolioPage section={section} />;
}
