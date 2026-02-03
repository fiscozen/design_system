import { toValue, watchEffect, nextTick, type MaybeRefOrGetter } from "vue";
import type { UseFzFetchReturn } from "../../types";
import { state } from "../../setup/state";

/**
 * Checks if body is serializable for deduplication purposes
 *
 * FormData, Blob, ArrayBuffer, and ReadableStream cannot be serialized with JSON.stringify.
 * URLSearchParams can be converted to string.
 */
const isBodySerializable = (
  body: BodyInit | null | undefined,
): boolean => {
  if (!body || typeof body === "string") return true;
  if (
    body instanceof FormData ||
    body instanceof Blob ||
    body instanceof ArrayBuffer ||
    body instanceof ReadableStream
  ) {
    return false;
  }
  if (body instanceof URLSearchParams) return true;
  try {
    JSON.stringify(body);
    return true;
  } catch {
    return false;
  }
};

/**
 * Wraps a fetch result to apply deduplication if enabled
 *
 * body supports MaybeRefOrGetter and is resolved at execute() time for the deduplication key.
 *
 * @param fetchResult - Result from fzFetcher
 * @param url - Request URL (computed or string)
 * @param method - HTTP method
 * @param body - Request body (reactive; resolved at execute() time)
 * @param deduplicationEnabled - Whether deduplication is enabled
 * @returns Wrapped fetch result with deduplicated execute
 */
export const wrapWithDeduplication = <T>(
  fetchResult: UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>,
  url: MaybeRefOrGetter<string>,
  method: string,
  body: MaybeRefOrGetter<BodyInit | null | undefined>,
  deduplicationEnabled: boolean,
): UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>> => {
  if (!deduplicationEnabled || !state.deduplicationManager) {
    return fetchResult;
  }

  // Wrap execute method to apply deduplication
  const originalExecute = fetchResult.execute;
  fetchResult.execute = async (throwOnFailed?: boolean) => {
    const bodyValue = toValue(body);

    // Skip deduplication for non-serializable bodies (FormData, Blob, etc.)
    if (!isBodySerializable(bodyValue)) {
      return originalExecute(throwOnFailed);
    }

    // Resolve URL to string for deduplication key
    const urlString = toValue(url);

    // Serialize body if needed (it might be an object or already a string)
    let bodyString: string | null = null;
    if (bodyValue !== null && bodyValue !== undefined) {
      if (typeof bodyValue === "string") {
        bodyString = bodyValue;
      } else if (bodyValue instanceof URLSearchParams) {
        bodyString = bodyValue.toString();
      } else {
        try {
          bodyString = JSON.stringify(bodyValue);
        } catch {
          return originalExecute(throwOnFailed);
        }
      }
    }

    // Check if identical request is already pending
    const pendingFetchResult = state.deduplicationManager!.getPendingRequest<T>(
      urlString,
      method,
      bodyString,
    );

    if (pendingFetchResult) {
      // Synchronize reactive state from pending request to current fetchResult
      const syncState = () => {
        fetchResult.statusCode.value = pendingFetchResult.statusCode.value;
        fetchResult.response.value = pendingFetchResult.response.value;
        fetchResult.error.value = pendingFetchResult.error.value;
        fetchResult.data.value = pendingFetchResult.data.value;
      };

      // Initial sync
      syncState();

      // Wait for pending request to complete and sync state reactively
      // We can't call execute() on pendingFetchResult because it might be the same
      // instance wrapped, causing infinite recursion
      if (pendingFetchResult.isFetching.value) {
        // Use watchEffect for more efficient reactive syncing
        // watchEffect automatically tracks all accessed reactive properties
        let unwatchSync: (() => void) | null = null;
        let isCleanedUp = false;

        await new Promise<void>((resolve) => {
          // WatchEffect automatically tracks all reactive dependencies
          // More efficient than watch with explicit array of sources
          unwatchSync = watchEffect(() => {
            // Sync state whenever any tracked property changes
            syncState();

            // Resolve promise and cleanup when request completes
            if (!pendingFetchResult.isFetching.value && !isCleanedUp) {
              isCleanedUp = true;
              // Use nextTick to ensure cleanup happens after current execution
              // This allows other pending requests to sync state before cleanup
              nextTick(() => {
                if (unwatchSync) {
                  unwatchSync();
                  unwatchSync = null;
                }
                resolve();
              });
            }
          });
        });
      } else {
        // Request already completed, sync state once
        // No need for reactive watch since request is done
        // (interceptors won't modify state after completion)
        syncState();
      }

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
