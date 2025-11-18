import type { UseFzFetchOptions } from "../types";

/**
 * Normalizes UseFzFetchOptions to remove null timeout values
 * since @vueuse/core's UseFetchOptions doesn't accept null
 *
 * @param options - UseFzFetchOptions that may contain null timeout
 * @returns Options with null timeout removed (if present)
 */
export const normalizeUseFzFetchOptions = (
  options?: UseFzFetchOptions,
): Omit<UseFzFetchOptions, "timeout"> & { timeout?: number } => {
  if (!options) {
    return {};
  }

  const { timeout, ...rest } = options;

  // If timeout is null, remove it (don't pass to createFetch)
  // If timeout is a number, keep it
  // If timeout is undefined, keep it undefined
  if (timeout === null) {
    return rest;
  }

  return { ...rest, timeout };
};

