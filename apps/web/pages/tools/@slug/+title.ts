import type { PageContext } from "vike/types";
import { SITE } from "@webdev/widgets/config";
import { toolPageTitle } from "../seo";
import type { Data } from "./+data";

export default (pageContext: PageContext<Data>) => toolPageTitle(pageContext.data.title, SITE.name);
