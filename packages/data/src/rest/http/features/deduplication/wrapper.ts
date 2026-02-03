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
 * Syncs reactive state from a pending/source fetch result to the target, then waits for
 * the source to complete (isFetching becomes false). Used when deduplicating: the current
 * request reuses the result of an in-flight request with the same key.
 *
 * @param target - Fetch result to update (our wrapper's fetchResult)
 * @param source - Pending fetch result to sync from (already in flight)
 * @param throwOnFailed - If true, throw after completion when source has an error
 */
const waitForPendingAndSyncState = async <T>(
  target: UseFzFetchReturn<T>,
  source: UseFzFetchReturn<T>,
  throwOnFailed?: boolean,
): Promise<void> => {
  const syncState = (): void => {
    target.statusCode.value = source.statusCode.value;
    target.response.value = source.response.value;
    target.error.value = source.error.value;
    target.data.value = source.data.value;
  };

  syncState();

  let unwatchSync: (() => void) | null = null;
  let isCleanedUp = false;

  await new Promise<void>((resolve) => {
    unwatchSync = watchEffect(() => {
      syncState();

      if (!source.isFetching.value && !isCleanedUp) {
        isCleanedUp = true;
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

  if (source.error.value && throwOnFailed) {
    throw source.error.value;
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

    // Only use pending for dedup when the request is actually in flight.
    // When the request interceptor modifies only headers, the outer deduplication wrapper
    // registers fetchResult before the interceptor runs; the base fetch never starts, so
    // isFetching stays false. If we treated that as a valid dedup target we would sync
    // empty state and return without making any HTTP request. Fall through to register
    // and execute when isFetching is false so the real request (e.g. modified fetch) runs.
    if (pendingFetchResult && pendingFetchResult.isFetching.value) {
      await waitForPendingAndSyncState(
        fetchResult,
        pendingFetchResult,
        throwOnFailed,
      );
      return;
    }

    // Register as pending request BEFORE executing to make it available immediately
    // This allows concurrent execute() calls to see this request as pending
    state.deduplicationManager!.registerPendingRequest(
      urlString,
      method,
      bodyString,
      fetchResult,
    );

    // Race condition mitigation: verify we're still the registered request after registration.
    // If another concurrent execute() overwrote our registration, wait for that one instead.
    const verifyRegistration = state.deduplicationManager!.getPendingRequest<T>(
      urlString,
      method,
      bodyString,
    );
    
    if (verifyRegistration !== fetchResult) {
      // Another request overwrote our registration
      if (verifyRegistration) {
        // Only wait for it when it is actually in flight (same as getPendingRequest check).
        // If isFetching is false it may be a placeholder (e.g. outer wrapper) that never started.
        if (verifyRegistration.isFetching.value) {
          await waitForPendingAndSyncState(
            fetchResult,
            verifyRegistration,
            throwOnFailed,
          );
          return;
        }
        // Placeholder (not in flight): overwrite with ourselves and fall through to execute
        state.deduplicationManager!.registerPendingRequest(
          urlString,
          method,
          bodyString,
          fetchResult,
        );
      }
      // verifyRegistration is null (cleaned up between register and verify),
      // or we overwrote a placeholder → fall through and execute our request
    }

    // Execute the original fetch
    const requestPromise = originalExecute(throwOnFailed);
    return requestPromise;
  };

  return fetchResult;
};
