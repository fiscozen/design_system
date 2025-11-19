import { toValue, type MaybeRefOrGetter } from "vue";
import type { UseFzFetchReturn } from "../../types";
import { state } from "../../setup/state";
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
            // Clone response once and reuse for parsing to avoid multiple clones
            try {
              const contentType = interceptedResponse.headers.get("content-type") || "";
              const clonedResponse = interceptedResponse.clone();
              
              if (contentType.includes("application/json")) {
                // Parse as JSON
                const jsonData = await clonedResponse.json();
                fetchResult.data.value = jsonData;
              } else if (contentType.includes("text/")) {
                // Parse as text
                const textData = await clonedResponse.text();
                fetchResult.data.value = textData as T;
              } else {
                // For other content types, try JSON first, fallback to text
                // Clone again since we already consumed the first clone
                try {
                  const clonedResponse2 = interceptedResponse.clone();
                  const jsonData = await clonedResponse2.json();
                  fetchResult.data.value = jsonData;
                } catch {
                  const clonedResponse3 = interceptedResponse.clone();
                  const textData = await clonedResponse3.text();
                  fetchResult.data.value = textData as T;
                }
              }

              if (state.globalDebug) {
                console.debug(
                  `[useFzFetch] Response modified by interceptor, body re-parsed: ${urlString}`,
                );
              }
            } catch (parseError: unknown) {
              // If parsing fails, set error and stop execution
              if (state.globalDebug) {
                console.debug(
                  `[useFzFetch] Failed to parse modified response body: ${parseError.message}`,
                );
              }
              const normalizedParseError = parseError instanceof Error ? parseError : new Error(String(parseError));
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
          const normalizedError = error instanceof Error ? error : new Error(String(error));
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

