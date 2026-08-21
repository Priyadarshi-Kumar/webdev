import type { PageContext } from "vike/types";
import { practicePageDescription } from "../seo";
import type { Data } from "./+data";

export default (pageContext: PageContext<Data>) => practicePageDescription(pageContext.data.description);
