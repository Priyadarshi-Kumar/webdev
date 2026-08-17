import type { PageContext } from "vike/types";
import { toolPageDescription } from "../seo";
import type { Data } from "./+data";

export default (pageContext: PageContext<Data>) => toolPageDescription(pageContext.data.description);
