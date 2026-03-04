import { state } from "../setup/state";

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
