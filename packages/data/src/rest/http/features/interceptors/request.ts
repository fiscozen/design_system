import { toValue, watch, type MaybeRefOrGetter } from "vue";
import type { UseFzFetchOptions, UseFzFetchReturn } from "../../types";
import { state } from "../../setup/state";
import { normalizeUseFzFetchOptions } from "../../utils/options";
import { normalizeError } from "../../utils/error";
import type { RequestInterceptor } from "./types";

/**
 * Compares two normalized header objects for equality
 *
 * Compares headers property-by-property instead of using JSON.stringify
 * for better performance and to avoid issues with property order.
 *
 * @param a - First normalized headers object
 * @param b - Second normalized headers object
 * @returns True if headers differ, false if they are equivalent
 */
const compareNormalizedHeaders = (
  a: Record<string, string>,
  b: Record<string, string>,
): boolean => {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  // Different number of keys means they differ
  if (keysA.length !== keysB.length) {
    return true;
  }

  // Compare each key-value pair
  for (const key of keysA) {
    if (a[key] !== b[key]) {
      return true;
    }
  }

  return false;
};

/**
 * Compares two RequestInit objects to detect if they differ
 *
 * Uses property-by-property comparison instead of JSON.stringify to handle:
 * - Headers objects (which don't serialize correctly with JSON.stringify)
 * - Body types (Blob, FormData, ArrayBuffer, etc.)
 * - Property order differences
 *
 * @param a - First RequestInit object
 * @param b - Second RequestInit object
 * @returns True if objects differ, false if they are equivalent
 */
const compareRequestInit = (a: RequestInit, b: RequestInit): boolean => {
  // Compare method
  if (a.method !== b.method) {
    return true;
  }

  // Compare headers using direct property comparison
  const headersA = normalizeHeaders(a.headers);
  const headersB = normalizeHeaders(b.headers);
  if (compareNormalizedHeaders(headersA, headersB)) {
    return true;
  }

  // Compare body
  // For strings, compare content; for other types (Blob, FormData, etc.), compare by reference
  if (a.body !== b.body) {
    // If both are strings, they're already compared by !== above
    // For other types, reference comparison is sufficient
    return true;
  }

  // Compare other properties
  const propsToCompare: (keyof RequestInit)[] = [
    "cache",
    "credentials",
    "integrity",
    "keepalive",
    "mode",
    "redirect",
    "referrer",
    "referrerPolicy",
    "signal",
  ];

  for (const prop of propsToCompare) {
    if (a[prop] !== b[prop]) {
      return true;
    }
  }

  return false;
};

/**
 * Normalizes Headers object to a plain object
 *
 * Converts Headers instance to Record<string, string> with lowercase keys.
 *
 * @param headers - Headers object instance
 * @returns Normalized headers as Record<string, string>
 */
const normalizeHeadersObject = (headers: Headers): Record<string, string> => {
  const normalized: Record<string, string> = {};
  headers.forEach((value, key) => {
    normalized[key.toLowerCase()] = value;
  });
  return normalized;
};

/**
 * Normalizes array of header tuples to a plain object
 *
 * Converts [string, string][] to Record<string, string> with lowercase keys.
 * Last value wins for duplicate keys (standard headers behavior).
 *
 * @param headers - Array of [key, value] tuples
 * @returns Normalized headers as Record<string, string>
 */
const normalizeHeadersArray = (
  headers: [string, string][],
): Record<string, string> => {
  const normalized: Record<string, string> = {};
  for (const [key, value] of headers) {
    // Last value wins for duplicate keys (standard headers behavior)
    normalized[key.toLowerCase()] = value;
  }
  return normalized;
};

/**
 * Normalizes plain object headers to lowercase keys
 *
 * Converts Record<string, string> to Record<string, string> with lowercase keys.
 * Last value wins for duplicate keys (standard headers behavior).
 *
 * @param headers - Plain object headers
 * @returns Normalized headers as Record<string, string>
 */
const normalizeHeadersPlainObject = (
  headers: Record<string, string>,
): Record<string, string> => {
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    // Last value wins for duplicate keys (standard headers behavior)
    normalized[key.toLowerCase()] = value;
  }
  return normalized;
};

/**
 * Normalizes headers to a plain object for comparison
 *
 * Handles Headers objects, Record<string, string>, and array of tuples [string, string][].
 * All header keys are normalized to lowercase for consistent comparison.
 *
 * @param headers - Headers to normalize
 * @returns Normalized headers as Record<string, string>
 */
const normalizeHeaders = (
  headers?: HeadersInit | null,
): Record<string, string> => {
  if (!headers) {
    return {};
  }

  // Handle Headers object
  if (headers instanceof Headers) {
    return normalizeHeadersObject(headers);
  }

  // Handle array of tuples [string, string][]
  if (Array.isArray(headers)) {
    return normalizeHeadersArray(headers);
  }

  // Handle plain object Record<string, string>
  return normalizeHeadersPlainObject(headers as Record<string, string>);
};

/**
 * Wraps a fetch result to apply request interceptor
 *
 * The request interceptor is applied when execute() is called, before the actual fetch.
 * If the interceptor modifies the requestInit, a new fetch call is made with the modified config.
 *
 * @param fetchResult - Result from fzFetcher
 * @param url - Request URL (computed or string)
 * @param requestInit - Original request configuration
 * @param useFetchOptions - Optional useFetchOptions for creating new fetch calls
 * @returns Wrapped fetch result with request interceptor applied
 */
export const wrapWithRequestInterceptor = <T>(
  fetchResult: UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>,
  url: MaybeRefOrGetter<string>,
  requestInit: RequestInit,
  useFetchOptions?: UseFzFetchOptions,
): UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>> => {
  // If no request interceptor is configured, return as-is
  if (!state.globalRequestInterceptor) {
    return fetchResult;
  }

  // Wrap execute method to apply request interceptor
  const originalExecute = fetchResult.execute;
  fetchResult.execute = async (throwOnFailed?: boolean) => {
    const urlString = toValue(url);

    // Apply request interceptor
    try {
      const interceptedRequest = await state.globalRequestInterceptor!(
        urlString,
        requestInit,
      );

      // If interceptor returns null, abort the request
      if (interceptedRequest === null) {
        if (state.globalDebug) {
          console.debug(
            `[useFzFetch] Request aborted by interceptor: ${urlString}`,
          );
        }
        const abortError = new Error(
          `Request aborted by interceptor: ${urlString}`,
        );
        abortError.name = "AbortError";
        fetchResult.error.value = abortError;
        if (throwOnFailed) {
          throw abortError;
        }
        return;
      }

      // If requestInit was modified, we need to make a new fetch call
      // Since @vueuse/core's createFetch doesn't allow dynamic requestInit modification,
      // we'll make a direct fetch call with the modified requestInit
      const requestInitChanged = compareRequestInit(
        interceptedRequest,
        requestInit,
      );

      if (requestInitChanged) {
        // Build full URL
        // If URL is absolute, use it directly
        // If URL is relative and globalBaseUrl is available, prepend it
        // If URL is relative and globalBaseUrl is null, use relative URL (fallback)
        const fullUrl = urlString.startsWith("http")
          ? urlString
          : state.globalBaseUrl
            ? `${state.globalBaseUrl.replace(/\/$/, "")}/${urlString.replace(/^\//, "")}`
            : urlString; // Fallback: use relative URL if globalBaseUrl not available

        if (state.globalDebug) {
          console.debug(
            `[useFzFetch] Request interceptor modified requestInit, using direct fetch: ${fullUrl}`,
          );
        }

        // Create a new fetch call with modified requestInit
        // Note: We can't update isFetching directly (it's readonly), so we'll
        // create a new fzFetcher call with the modified requestInit instead
        // This ensures all reactive state is properly managed
        // We'll use fzFetcher directly with the modified requestInit
        if (!state.fzFetcher) {
          throw new Error(
            "[useFzFetch] Cannot apply request interceptor: fzFetcher not initialized",
          );
        }

        const modifiedFetchResult = state
          .fzFetcher<T>(
            fullUrl,
            interceptedRequest,
            useFetchOptions
              ? normalizeUseFzFetchOptions(useFetchOptions)
              : undefined,
          )
          .json();

        // Synchronize state reactively from modified fetch to original result
        // This ensures state stays in sync even if modifiedFetchResult changes after initial sync
        // Note: isFetching is readonly and cannot be synced, but we observe it to know when request completes
        const unwatchSync = watch(
          [
            () => modifiedFetchResult.response.value,
            () => modifiedFetchResult.statusCode.value,
            () => modifiedFetchResult.data.value,
            () => modifiedFetchResult.error.value,
          ],
          () => {
            // Sync all state properties reactively
            fetchResult.response.value = modifiedFetchResult.response.value;
            fetchResult.statusCode.value = modifiedFetchResult.statusCode.value;
            fetchResult.data.value = modifiedFetchResult.data.value;
            fetchResult.error.value = modifiedFetchResult.error.value;
          },
          { immediate: true, deep: false },
        );

        // Execute the modified fetch and handle errors
        try {
          await modifiedFetchResult.execute(throwOnFailed);
        } catch (error: unknown) {
          // Stop watching before handling error to prevent further sync
          unwatchSync();

          const normalizedError = normalizeError(error);
          fetchResult.error.value = normalizedError;
          if (throwOnFailed) {
            throw normalizedError;
          }
          return;
        }

        // Stop watching when request completes (success or error)
        // The watch will have already synced the final state
        unwatchSync();

        return;
      }

      // If requestInit wasn't modified, execute original request
      return originalExecute(throwOnFailed);
    } catch (error: unknown) {
      // If interceptor throws, abort the request
      const normalizedError = normalizeError(error);
      if (state.globalDebug) {
        console.debug(
          `[useFzFetch] Request interceptor error: ${normalizedError.message}`,
        );
      }
      fetchResult.error.value = normalizedError;
      if (throwOnFailed) {
        throw normalizedError;
      }
      return;
    }
  };

  return fetchResult;
};
