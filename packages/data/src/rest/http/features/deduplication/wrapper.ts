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

  /**
   * Checks if body is serializable for deduplication purposes
   * 
   * FormData, Blob, ArrayBuffer, and ReadableStream cannot be serialized with JSON.stringify.
   * URLSearchParams can be converted to string.
   */
  const isBodySerializable = (body: BodyInit | null | undefined): boolean => {
    if (!body || typeof body === "string") return true;
    if (body instanceof FormData || body instanceof Blob || 
        body instanceof ArrayBuffer || body instanceof ReadableStream) {
      return false;
    }
    if (body instanceof URLSearchParams) return true;
    // Try to serialize to check if it's a plain object/array
    try {
      JSON.stringify(body);
      return true;
    } catch {
      return false;
    }
  };

  // Skip deduplication for non-serializable bodies (FormData, Blob, ArrayBuffer, ReadableStream)
  if (!isBodySerializable(body)) {
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
      } else if (body instanceof URLSearchParams) {
        // URLSearchParams can be converted to string
        bodyString = body.toString();
      } else {
        // Serialize object/array to JSON string
        // At this point we know it's serializable (checked above)
        try {
          bodyString = JSON.stringify(body);
        } catch {
          // Fallback: skip deduplication if serialization fails
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
      // Use watch to keep state synchronized if pending request changes after initial sync
      const syncState = () => {
        fetchResult.statusCode.value = pendingFetchResult.statusCode.value;
        fetchResult.response.value = pendingFetchResult.response.value;
        fetchResult.error.value = pendingFetchResult.error.value;
        fetchResult.data.value = pendingFetchResult.data.value;
      };

      // Initial sync
      syncState();

      // Continue syncing if pending request state changes (e.g., from interceptors)
      const unwatchSync = watch(
        [
          () => pendingFetchResult.data.value,
          () => pendingFetchResult.error.value,
          () => pendingFetchResult.statusCode.value,
          () => pendingFetchResult.response.value,
        ],
        () => {
          syncState();
        },
        { immediate: false }
      );

      // Cleanup watch when this request completes or when pending request is removed
      // The watch will be cleaned up when pendingFetchResult.isFetching becomes false
      // and DeduplicationManager removes it from pendingRequests
      watch(
        () => pendingFetchResult.isFetching.value,
        (isFetching: boolean) => {
          if (!isFetching) {
            // Small delay to allow other pending requests to sync before cleanup
            setTimeout(() => {
              unwatchSync();
            }, 100);
          }
        },
        { immediate: true }
      );

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

