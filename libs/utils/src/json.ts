export type JsonParseResult = { ok: true; value: unknown } | { ok: false; error: string };
export type JsonTextResult = { ok: true; output: string } | { ok: false; error: string };

export function validateJson(input: string): JsonParseResult {
  try {
    return { ok: true, value: JSON.parse(input) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Invalid JSON" };
  }
}

export function formatJson(input: string): JsonTextResult {
  const result = validateJson(input);
  if (!result.ok) return result;
  return { ok: true, output: JSON.stringify(result.value, null, 2) };
}

export function minifyJson(input: string): JsonTextResult {
  const result = validateJson(input);
  if (!result.ok) return result;
  return { ok: true, output: JSON.stringify(result.value) };
}
