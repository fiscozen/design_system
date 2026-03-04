import { state } from "../setup/state";

/**
 * Converts any valid `HeadersInit` format to a plain `Record<string, string>`.
 *
 * Handles `Headers` instances, `string[][]` tuples, and plain objects.
 * Needed because `RequestInit.headers` accepts all three formats.
 *
 * @param headers - Headers in any `HeadersInit`-compatible format
 * @returns Plain key-value record
 */
export const normalizeHeadersInit = (
  headers: HeadersInit,
): Record<string, string> => {
  if (headers instanceof Headers) {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  if (Array.isArray(headers)) {
    const result: Record<string, string> = {};
    for (const [key, value] of headers) {
      result[key] = value;
    }
    return result;
  }

  return { ...headers };
};

/**
 * Merges global default headers with per-request headers.
 *
 * Per-request keys set to `undefined` remove the corresponding default header.
 * Per-request keys with a string value override the default.
 * Default headers not mentioned in per-request are kept as-is.
 *
 * @param perRequestHeaders - Per-request headers (may contain undefined values)
 * @returns Merged headers with undefined entries removed
 */
export const mergeHeaders = (
  perRequestHeaders: Record<string, string | undefined> = {},
): Record<string, string> => {
  const defaults = state.globalDefaultHeaders;
  if (!defaults) {
    return filterUndefined(perRequestHeaders);
  }

  const merged: Record<string, string | undefined> = {
    ...defaults,
    ...perRequestHeaders,
  };

  return filterUndefined(merged);
};

/**
 * Removes entries with undefined values from a headers record.
 */
const filterUndefined = (
  headers: Record<string, string | undefined>,
): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
};
