import type { ComponentType } from "react";
import { Base64Tool, HtmlEntitiesTool, UrlEncodeTool } from "./encoding-tools";
import { CaseTool } from "./case-tool";
import { BytesTool } from "./bytes-tool";
import { ColorTool } from "./color-tool";
import { CsvJsonTool } from "./csv-json-tool";
import { DiffTool } from "./diff-tool";
import { HashTool } from "./hash-tool";
import { JsonConverter } from "./json-converter";
import { JwtDecoder } from "./jwt-decoder";
import { PasswordTool } from "./password-tool";
import { RegexTool } from "./regex-tool";
import { SemverTool } from "./semver-tool";
import { SlugifyTool } from "./slugify-tool";
import { TimestampTool } from "./timestamp-tool";
import { UuidGenerator } from "./uuid-generator";

export const toolUi: Record<string, ComponentType> = {
  json: JsonConverter,
  base64: Base64Tool,
  "url-encode": UrlEncodeTool,
  "html-entities": HtmlEntitiesTool,
  jwt: JwtDecoder,
  uuid: UuidGenerator,
  hash: HashTool,
  timestamp: TimestampTool,
  regex: RegexTool,
  color: ColorTool,
  case: CaseTool,
  slugify: SlugifyTool,
  diff: DiffTool,
  "csv-json": CsvJsonTool,
  password: PasswordTool,
  bytes: BytesTool,
  semver: SemverTool,
};
