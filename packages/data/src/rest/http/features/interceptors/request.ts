import { toValue, watch, nextTick, type MaybeRefOrGetter } from "vue";
import type { UseFzFetchOptions, UseFzFetchReturn } from "../../types";
import { state } from "../../setup/state";
import { normalizeUseFzFetchOptions } from "../../utils/options";
import { handleFetchError } from "../../utils/error";
import { parseResponseBody } from "../../utils/response";

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
 * Handles aborted request when interceptor returns null
 */
const handleAbortedRequest = <T>(
  fetchResult: UseFzFetchReturn<T>,
  urlString: string,
  throwOnFailed?: boolean,
): void => {
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
};

/**
 * Creates a new fetch request with modified requestInit
 */
const createModifiedFetchRequest = <T>(
  fullUrl: string,
  interceptedRequest: RequestInit,
  useFetchOptions?: UseFzFetchOptions,
): UseFzFetchReturn<T> => {
  if (!state.fzFetcher) {
    throw new Error(
      "[useFzFetch] Cannot apply request interceptor: fzFetcher not initialized",
    );
  }

  if (state.globalDebug) {
    console.debug(
      `[useFzFetch] Request interceptor modified requestInit, using direct fetch: ${fullUrl}`,
    );
  }

  const normalizedOptions = useFetchOptions
    ? normalizeUseFzFetchOptions(useFetchOptions)
    : {};

  return state
    .fzFetcher<T>(fullUrl, interceptedRequest, {
      ...normalizedOptions,
      immediate: false,
    })
    .json();
};

/**
 * Synchronizes state from source fetch result to target fetch result
 * Returns cleanup function to stop watching
 */
const syncFetchResultState = <T>(
  source: UseFzFetchReturn<T>,
  target: UseFzFetchReturn<T>,
): () => void => {
  const unwatchSync = watch(
    [
      () => source.response.value,
      () => source.statusCode.value,
      () => source.data.value,
      () => source.error.value,
    ],
    () => {
      // Sync all state properties reactively
      target.response.value = source.response.value;
      target.statusCode.value = source.statusCode.value;
      target.data.value = source.data.value;
      target.error.value = source.error.value;
    },
    { immediate: true, deep: false },
  );

  return unwatchSync;
};

/**
 * Handles fetch completion: cleans up watch and resolves Promise
 *
 * Called when isFetching becomes false. Uses nextTick to ensure all state
 * updates are propagated before resolving the Promise.
 *
 * @param unwatchFetching - Function to stop watching
 * @param resolve - Promise resolve function
 */
const handleFetchCompletion = (
  unwatchFetching: () => void,
  resolve: () => void,
) => {
  // Request fully completed, cleanup watch after nextTick
  // to ensure all state updates are propagated
  nextTick(() => {
    unwatchFetching();
    resolve();
  });
};

/**
 * Sets up a watcher to monitor fetch completion and resolve Promise when done
 *
 * Watches isFetching and resolves the Promise when it becomes false.
 * Returns the unwatch function for cleanup.
 *
 * @param fetchResult - Fetch result to watch
 * @param resolve - Promise resolve function
 * @returns Function to stop watching
 */
const setupFetchCompletionWatcher = <T>(
  fetchResult: UseFzFetchReturn<T>,
  resolve: () => void,
): (() => void) => {
  let unwatchFetching: (() => void) | null = null;
  unwatchFetching = watch(
    () => fetchResult.isFetching.value,
    (isFetching) => {
      if (!isFetching && unwatchFetching) {
        handleFetchCompletion(unwatchFetching, resolve);
      }
    },
    { immediate: true },
  );
  return unwatchFetching;
};

/**
 * Waits for a fetch request to fully complete (isFetching becomes false)
 *
 * Ensures all state updates are propagated before proceeding.
 * This is necessary when synchronizing state between fetch results.
 *
 * @param fetchResult - Fetch result to wait for
 * @returns Promise that resolves when request is fully complete
 */
const waitForFetchCompletion = <T>(
  fetchResult: UseFzFetchReturn<T>,
): Promise<void> => {
  if (!fetchResult.isFetching.value) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    setupFetchCompletionWatcher(fetchResult, resolve);
  });
};

/**
 * Cleans up watcher and stops execution when an error occurs
 *
 * Ensures request completion and proper cleanup before returning.
 * Only clears currentWatch if it still refers to the watcher being cleaned up,
 * preventing race conditions when execute() is called multiple times rapidly.
 *
 * @param modifiedFetchResult - Modified fetch result to wait for
 * @param unwatchSync - Function to stop watching
 * @param cleanupCallback - Callback to conditionally set currentWatch to null
 */
const cleanupWatcherOnError = async <T>(
  modifiedFetchResult: UseFzFetchReturn<T>,
  unwatchSync: () => void,
  cleanupCallback: (watcherToCleanup: () => void) => void,
): Promise<void> => {
  // Wait for request to fully complete before cleanup
  await waitForFetchCompletion(modifiedFetchResult);
  // Clean up watcher to prevent memory leak
  nextTick(() => {
    unwatchSync();
    cleanupCallback(unwatchSync);
  });
};

/**
 * Applies response interceptor when request interceptor modified the request
 *
 * When a request interceptor modifies requestInit, a new fetch is created that bypasses
 * the normal wrapper chain. This means the response interceptor won't be applied automatically.
 * This function manually applies the response interceptor so that response transformation
 * works consistently regardless of whether the request was modified.
 *
 * @param originalResponse - Original response from fetch
 * @param urlString - Request URL string
 * @param interceptedRequest - Intercepted request init
 * @returns Intercepted response (may be modified or same as original)
 */
const applyResponseInterceptor = async (
  originalResponse: Response,
  urlString: string,
  interceptedRequest: RequestInit,
): Promise<Response> => {
  if (!state.globalResponseInterceptor) {
    return originalResponse;
  }

  return await state.globalResponseInterceptor(
    originalResponse,
    urlString,
    interceptedRequest,
  );
};

/**
 * Updates response and statusCode in both fetch results if response was modified
 *
 * @param modifiedFetchResult - Modified fetch result
 * @param fetchResult - Original fetch result to sync with
 * @param interceptedResponse - Response from interceptor
 * @param originalResponse - Original response before interception
 */
const updateResponseState = <T>(
  modifiedFetchResult: UseFzFetchReturn<T>,
  fetchResult: UseFzFetchReturn<T>,
  interceptedResponse: Response,
  originalResponse: Response,
): void => {
  if (interceptedResponse !== originalResponse) {
    modifiedFetchResult.response.value = interceptedResponse;
    fetchResult.response.value = interceptedResponse;
    modifiedFetchResult.statusCode.value = interceptedResponse.status;
    fetchResult.statusCode.value = interceptedResponse.status;
  }
};

/**
 * Re-parses response body and updates data in both fetch results
 *
 * @vueuse/core doesn't automatically re-parse when response changes, so we must
 * manually parse the modified response body.
 *
 * @param modifiedFetchResult - Modified fetch result
 * @param fetchResult - Original fetch result to sync with
 * @param interceptedResponse - Modified response to parse
 * @param urlString - Request URL string for debug logging
 * @returns Parsed data
 */
const reparseResponseBody = async <T>(
  modifiedFetchResult: UseFzFetchReturn<T>,
  fetchResult: UseFzFetchReturn<T>,
  interceptedResponse: Response,
  urlString: string,
): Promise<T> => {
  const parsedData = await parseResponseBody<T>(interceptedResponse);
  modifiedFetchResult.data.value = parsedData;
  fetchResult.data.value = parsedData;

  if (state.globalDebug) {
    console.debug(
      `[useFzFetch] Response modified by interceptor, body re-parsed: ${urlString}`,
    );
  }

  return parsedData;
};

/**
 * Handles error with watcher cleanup
 *
 * Stops watcher immediately to prevent it from overwriting the error.
 * The watcher syncs modifiedFetchResult.error (which is null since fetch succeeded)
 * to fetchResult.error, which would overwrite the error we're about to set.
 *
 * @param modifiedFetchResult - Modified fetch result to wait for completion
 * @param fetchResult - Original fetch result to set error on
 * @param error - Error that occurred
 * @param throwOnFailed - Whether to throw on errors
 * @param unwatchSync - Function to stop watching
 * @param cleanupCallback - Callback to conditionally set currentWatch to null
 * @param debugMessage - Debug message to log if globalDebug is enabled
 * @returns Promise that resolves when cleanup is complete
 */
const handleErrorWithCleanup = async <T>(
  modifiedFetchResult: UseFzFetchReturn<T>,
  fetchResult: UseFzFetchReturn<T>,
  error: unknown,
  throwOnFailed: boolean | undefined,
  unwatchSync: () => void,
  cleanupCallback: (watcherToCleanup: () => void) => void,
  debugMessage: string,
): Promise<void> => {
  unwatchSync();
  cleanupCallback(unwatchSync);

  const normalizedError = handleFetchError(
    fetchResult.error,
    error,
    throwOnFailed,
  );
  if (state.globalDebug) {
    console.debug(`[useFzFetch] ${debugMessage}: ${normalizedError.message}`);
  }

  await waitForFetchCompletion(modifiedFetchResult);
};

/**
 * Applies response interceptor and re-parses body if response was modified
 *
 * Orchestrates the response interception flow:
 * - Runs the response interceptor
 * - Updates response and statusCode if modified
 * - Re-parses the body if response was modified
 * - Handles errors from interceptor or parsing
 *
 * @param modifiedFetchResult - Modified fetch result
 * @param fetchResult - Original fetch result to sync with
 * @param urlString - Request URL string
 * @param interceptedRequest - Intercepted request init
 * @param throwOnFailed - Whether to throw on errors
 * @param unwatchSync - Function to stop watching
 * @param cleanupCallback - Callback to conditionally set currentWatch to null
 * @returns Promise that resolves to true if execution should continue, false if should stop
 */
const applyResponseInterceptorAndReparse = async <T>(
  modifiedFetchResult: UseFzFetchReturn<T>,
  fetchResult: UseFzFetchReturn<T>,
  urlString: string,
  interceptedRequest: RequestInit,
  throwOnFailed: boolean | undefined,
  unwatchSync: () => void,
  cleanupCallback: (watcherToCleanup: () => void) => void,
): Promise<boolean> => {
  // Skip if no response interceptor or no response
  if (!state.globalResponseInterceptor || !modifiedFetchResult.response.value) {
    return true;
  }

  const originalResponse = modifiedFetchResult.response.value;

  try {
    const interceptedResponse = await applyResponseInterceptor(
      originalResponse,
      urlString,
      interceptedRequest,
    );

    // Update response if interceptor modified it
    updateResponseState(
      modifiedFetchResult,
      fetchResult,
      interceptedResponse,
      originalResponse,
    );

    // Re-parse body if response was modified
    if (interceptedResponse !== originalResponse) {
      try {
        await reparseResponseBody<T>(
          modifiedFetchResult,
          fetchResult,
          interceptedResponse,
          urlString,
        );
      } catch (parseError: unknown) {
        await handleErrorWithCleanup(
          modifiedFetchResult,
          fetchResult,
          parseError,
          throwOnFailed,
          unwatchSync,
          cleanupCallback,
          "Failed to parse modified response body",
        );
        return false;
      }
    }

    return true;
  } catch (error: unknown) {
    await handleErrorWithCleanup(
      modifiedFetchResult,
      fetchResult,
      error,
      throwOnFailed,
      unwatchSync,
      cleanupCallback,
      "Response interceptor error on modified fetch",
    );
    return false;
  }
};

/**
 * Handles errors from interceptor execution
 */
const handleInterceptorError = <T>(
  fetchResult: UseFzFetchReturn<T>,
  error: unknown,
  throwOnFailed?: boolean,
  watchCleanup?: (() => void) | null,
): void => {
  // Cleanup watch if it exists
  if (watchCleanup) {
    watchCleanup();
  }

  const normalizedError = handleFetchError(
    fetchResult.error,
    error,
    throwOnFailed,
  );

  if (state.globalDebug) {
    console.debug(
      `[useFzFetch] Request interceptor error: ${normalizedError.message}`,
    );
  }
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
  // Track current watch to cleanup when execute() is called multiple times rapidly
  let currentWatch: (() => void) | null = null;

  fetchResult.execute = async (throwOnFailed?: boolean) => {
    // Always re-evaluate the URL when execute() is called manually
    // This ensures reactive URLs (computed URLs that depend on reactive values) are properly evaluated
    const urlString = toValue(url);

    // Cleanup previous watch if it exists (in case execute() was called multiple times)
    if (currentWatch) {
      currentWatch();
      currentWatch = null;
    }

    // Apply request interceptor
    try {
      const interceptedRequest = await state.globalRequestInterceptor!(
        urlString,
        requestInit,
      );

      // If interceptor returns null, abort the request
      if (interceptedRequest === null) {
        handleAbortedRequest(fetchResult, urlString, throwOnFailed);
        return;
      }

      // Check if requestInit was modified
      const requestInitChanged = compareRequestInit(
        interceptedRequest,
        requestInit,
      );

      if (requestInitChanged) {
        const modifiedFetchResult = createModifiedFetchRequest<T>(
          urlString,
          interceptedRequest,
          useFetchOptions,
        );

        // Synchronize state reactively from modified fetch to original result
        const unwatchSync = syncFetchResultState(
          modifiedFetchResult,
          fetchResult,
        );
        currentWatch = unwatchSync;

        // Execute the modified fetch and wait for completion
        try {
          await modifiedFetchResult.execute(throwOnFailed);

          // Apply response interceptor since modified fetch bypasses wrapper chain
          const shouldContinue = await applyResponseInterceptorAndReparse(
            modifiedFetchResult,
            fetchResult,
            urlString,
            interceptedRequest,
            throwOnFailed,
            unwatchSync,
            (watcherToCleanup) => {
              // Only clear currentWatch if it still refers to the watcher being cleaned up
              // This prevents race conditions when execute() is called multiple times rapidly
              if (currentWatch === watcherToCleanup) {
                currentWatch = null;
              }
            },
          );

          // Stop execution if response interceptor or parsing failed
          if (!shouldContinue) {
            return;
          }
        } catch (error: unknown) {
          // Wait for request to fully complete even on error
          // This ensures state is fully synchronized before handling the error
          await waitForFetchCompletion(modifiedFetchResult);

          // handleFetchError will throw if throwOnFailed is true
          const normalizedError = handleFetchError(
            fetchResult.error,
            error,
            throwOnFailed,
          );
          if (state.globalDebug) {
            console.debug(
              `[useFzFetch] Modified fetch request error: ${normalizedError.message}`,
            );
          }
          // If throwOnFailed is false, we return here (error is set on fetchResult.error)
          // If throwOnFailed is true, handleFetchError already threw, so this won't execute
          // Clean up watcher to prevent memory leak
          await cleanupWatcherOnError(
            modifiedFetchResult,
            unwatchSync,
            (watcherToCleanup) => {
              // Only clear currentWatch if it still refers to the watcher being cleaned up
              // This prevents race conditions when execute() is called multiple times rapidly
              if (currentWatch === watcherToCleanup) {
                currentWatch = null;
              }
            },
          );
          return;
        }

        // Wait for request to fully complete before stopping watch
        // This ensures all state updates are propagated
        await waitForFetchCompletion(modifiedFetchResult);

        // Stop watching when request fully completes (success or error)
        // Use nextTick to ensure all state updates are propagated before cleanup
        // Only clear currentWatch if it still refers to the watcher being cleaned up
        // This prevents race conditions when execute() is called multiple times rapidly
        nextTick(() => {
          unwatchSync();
          if (currentWatch === unwatchSync) {
            currentWatch = null;
          }
        });
        return;
      }

      // If requestInit wasn't modified, execute original request
      // URL is already re-evaluated above with toValue(url)
      return await originalExecute(throwOnFailed);
    } catch (error: unknown) {
      // If interceptor throws, handle error
      handleInterceptorError(fetchResult, error, throwOnFailed, currentWatch);
      currentWatch = null;
      return;
    }
  };

  return fetchResult;
};
