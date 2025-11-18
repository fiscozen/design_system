import { toValue, type MaybeRefOrGetter } from "vue";
import type { UseFzFetchOptions, UseFzFetchReturn } from "../../types";
import { state } from "../../setup/state";
import { normalizeUseFzFetchOptions } from "../../utils/options";
import type { RequestInterceptor } from "./types";

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
const compareRequestInit = (
  a: RequestInit,
  b: RequestInit,
): boolean => {
  // Compare method
  if (a.method !== b.method) {
    return true;
  }

  // Compare headers
  const headersA = normalizeHeaders(a.headers);
  const headersB = normalizeHeaders(b.headers);
  if (JSON.stringify(headersA) !== JSON.stringify(headersB)) {
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
 * Normalizes headers to a plain object for comparison
 *
 * Handles both Headers objects and Record<string, string>
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

  // If it's already a plain object, return it
  if (!(headers instanceof Headers)) {
    return headers as Record<string, string>;
  }

  // Convert Headers object to plain object
  const normalized: Record<string, string> = {};
  headers.forEach((value, key) => {
    normalized[key.toLowerCase()] = value;
  });
  return normalized;
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

      if (requestInitChanged && state.globalBaseUrl) {
        // Build full URL
        const fullUrl = urlString.startsWith("http")
          ? urlString
          : `${state.globalBaseUrl.replace(/\/$/, "")}/${urlString.replace(/^\//, "")}`;

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

        const modifiedFetchResult = state.fzFetcher<T>(
          fullUrl,
          interceptedRequest,
          useFetchOptions
            ? normalizeUseFzFetchOptions(useFetchOptions)
            : undefined,
        ).json();

        // Execute the modified fetch and update the original result
        try {
          await modifiedFetchResult.execute(throwOnFailed);

          // Copy results from modified fetch to original result
          fetchResult.response.value = modifiedFetchResult.response.value;
          fetchResult.statusCode.value = modifiedFetchResult.statusCode.value;
          fetchResult.data.value = modifiedFetchResult.data.value;
          fetchResult.error.value = modifiedFetchResult.error.value;
        } catch (error: any) {
          fetchResult.error.value = error;
          if (throwOnFailed) {
            throw error;
          }
        }

        return;
      }

      // If requestInit wasn't modified, execute original request
      return originalExecute(throwOnFailed);
    } catch (error: any) {
      // If interceptor throws, abort the request
      if (state.globalDebug) {
        console.debug(
          `[useFzFetch] Request interceptor error: ${error.message}`,
        );
      }
      fetchResult.error.value = error;
      if (throwOnFailed) {
        throw error;
      }
      return;
    }
  };

  return fetchResult;
};

