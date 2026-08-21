import type { PageContext } from "vike/types";
import { SITE } from "@webdev/widgets/config";
import { practicePageTitle } from "../seo";
import type { Data } from "./+data";

export default (pageContext: PageContext<Data>) => practicePageTitle(pageContext.data.title, SITE.name);
