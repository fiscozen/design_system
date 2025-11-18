import { toValue, watch, type MaybeRefOrGetter } from "vue";
import type { UseFzFetchReturn } from "../../types";
import { state } from "../../setup/state";

/**
 * Wraps a fetch result to apply deduplication if enabled
 *
 * @param fetchResult - Result from fzFetcher
 * @param url - Request URL (computed or string)
 * @param method - HTTP method
 * @param body - Request body (can be string, object, or null)
 * @param deduplicationEnabled - Whether deduplication is enabled
 * @returns Wrapped fetch result with deduplicated execute
 */
export const wrapWithDeduplication = <T>(
  fetchResult: UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>,
  url: MaybeRefOrGetter<string>,
  method: string,
  body: BodyInit | null | undefined,
  deduplicationEnabled: boolean,
): UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>> => {
  if (!deduplicationEnabled || !state.deduplicationManager) {
    return fetchResult;
  }

  // Wrap execute method to apply deduplication
  const originalExecute = fetchResult.execute;
  fetchResult.execute = async (throwOnFailed?: boolean) => {
    // Resolve URL to string for deduplication key
    const urlString = toValue(url);

    // Serialize body if needed (it might be an object or already a string)
    let bodyString: string | null = null;
    if (body !== null && body !== undefined) {
      if (typeof body === "string") {
        bodyString = body;
      } else {
        // Serialize object/array to JSON string
        bodyString = JSON.stringify(body);
      }
    }

    // Check if identical request is already pending
    const pendingFetchResult = state.deduplicationManager!.getPendingRequest<T>(
      urlString,
      method,
      bodyString,
    );

    if (pendingFetchResult) {
      // Wait for pending request to complete by watching isFetching
      // We can't call execute() on pendingFetchResult because it might be the same
      // instance wrapped, causing infinite recursion
      if (pendingFetchResult.isFetching.value) {
        await new Promise<void>((resolve) => {
          const unwatch = watch(
            () => pendingFetchResult.isFetching.value,
            (isFetching: boolean) => {
              if (!isFetching) {
                unwatch();
                resolve();
              }
            },
            { immediate: true },
          );
        });
      }

      // Synchronize reactive state from pending request to current fetchResult
      fetchResult.statusCode.value = pendingFetchResult.statusCode.value;
      fetchResult.response.value = pendingFetchResult.response.value;
      fetchResult.error.value = pendingFetchResult.error.value;
      fetchResult.data.value = pendingFetchResult.data.value;

      // If there was an error and throwOnFailed is true, throw it
      if (pendingFetchResult.error.value && throwOnFailed) {
        throw pendingFetchResult.error.value;
      }

      // Return without executing a new request
      return;
    }

    // Create new request
    const requestPromise = originalExecute(throwOnFailed);

    // Register as pending request (before await to make it available immediately)
    state.deduplicationManager!.registerPendingRequest(
      urlString,
      method,
      bodyString,
      fetchResult,
    );

    return requestPromise;
  };

  return fetchResult;
};

