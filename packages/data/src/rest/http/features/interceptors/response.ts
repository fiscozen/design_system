import { toValue, type MaybeRefOrGetter } from "vue";
import type { UseFzFetchReturn } from "../../types";
import { state } from "../../setup/state";
import { normalizeError } from "../../utils/error";
import { parseResponseBody } from "../../utils/response";
import type { ResponseInterceptor } from "./types";

/**
 * Wraps a fetch result to apply response interceptor
 *
 * @param fetchResult - Result from fzFetcher
 * @param url - Request URL (computed or string)
 * @param requestInit - Original request configuration
 * @returns Wrapped fetch result with response interceptor applied
 */
export const wrapWithResponseInterceptor = <T>(
  fetchResult: UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>,
  url: MaybeRefOrGetter<string>,
  requestInit: RequestInit,
): UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>> => {
  // If no response interceptor is configured, return as-is
  if (!state.globalResponseInterceptor) {
    return fetchResult;
  }

  // Wrap execute method to apply response interceptor
  const originalExecute = fetchResult.execute;
  fetchResult.execute = async (throwOnFailed?: boolean) => {
    const urlString = toValue(url);

    try {
      // Execute original request
      await originalExecute(throwOnFailed);

      // Apply response interceptor if response is available
      if (state.globalResponseInterceptor && fetchResult.response.value) {
        try {
          const interceptedResponse = await state.globalResponseInterceptor(
            fetchResult.response.value,
            urlString,
            requestInit,
          );

          // Update response if interceptor modified it
          if (interceptedResponse !== fetchResult.response.value) {
            fetchResult.response.value = interceptedResponse;
            fetchResult.statusCode.value = interceptedResponse.status;

            // Re-parse body if response was modified
            // @vueuse/core doesn't automatically re-parse when response changes
            try {
              const parsedData = await parseResponseBody<T>(interceptedResponse);
              fetchResult.data.value = parsedData;

              if (state.globalDebug) {
                console.debug(
                  `[useFzFetch] Response modified by interceptor, body re-parsed: ${urlString}`,
                );
              }
            } catch (parseError: unknown) {
              // If parsing fails, set error and stop execution
              // Normalize error immediately to ensure it's always an Error instance
              const normalizedParseError = normalizeError(parseError);
              if (state.globalDebug) {
                console.debug(
                  `[useFzFetch] Failed to parse modified response body: ${normalizedParseError.message}`,
                );
              }
              fetchResult.error.value = normalizedParseError;
              if (throwOnFailed) {
                throw normalizedParseError;
              }
              // Stop execution when error is set (don't continue processing)
              return;
            }
          }
        } catch (error: unknown) {
          // If response interceptor throws, treat as error and stop execution
          const normalizedError = normalizeError(error);
          if (state.globalDebug) {
            console.debug(
              `[useFzFetch] Response interceptor error: ${normalizedError.message}`,
            );
          }
          fetchResult.error.value = normalizedError;
          if (throwOnFailed) {
            throw normalizedError;
          }
          // Stop execution when error is set (don't continue processing)
          return;
        }
      }
    } catch (error: unknown) {
      // Re-throw original errors
      throw error;
    }
  };

  return fetchResult;
};

