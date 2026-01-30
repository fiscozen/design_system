import { toValue, type MaybeRefOrGetter } from "vue";
import type { UseFzFetchReturn } from "../../types";
import { state } from "../../setup/state";
import { handleFetchError } from "../../utils/error";
import { parseResponseBody } from "../../utils/response";
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
            const parsedData =
              await parseResponseBody<T>(interceptedResponse);
            fetchResult.data.value = parsedData;

            if (state.globalDebug) {
              console.debug(
                `[useFzFetch] Response modified by interceptor, body re-parsed: ${urlString}`,
              );
            }
          } catch (parseError: unknown) {
            // If parsing fails, set error and stop execution
            const normalizedError = handleFetchError(
              fetchResult.error,
              parseError,
              throwOnFailed,
            );
            if (state.globalDebug) {
              console.debug(
                `[useFzFetch] Failed to parse modified response body: ${normalizedError.message}`,
              );
            }
            // Stop execution when error is set (don't continue processing)
            return;
          }
        }
      } catch (error: unknown) {
        // If response interceptor throws, treat as error and stop execution
        const normalizedError = handleFetchError(
          fetchResult.error,
          error,
          throwOnFailed,
        );
        if (state.globalDebug) {
          console.debug(
            `[useFzFetch] Response interceptor error: ${normalizedError.message}`,
          );
        }
        // Stop execution when error is set (don't continue processing)
        return;
      }
    }
  };

  return fetchResult;
};
