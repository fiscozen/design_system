import type { UseFzFetchOptions } from "../types";

/**
 * Normalizes UseFzFetchOptions for use with @vueuse/core's createFetch
 *
 * @param options - UseFzFetchOptions
 * @returns Normalized options
 */
export const normalizeUseFzFetchOptions = (
  options?: UseFzFetchOptions,
): UseFzFetchOptions => {
  if (!options) {
    return {};
  }

  return options;
};
