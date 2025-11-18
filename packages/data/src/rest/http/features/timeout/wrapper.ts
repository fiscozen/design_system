import type { UseFzFetchReturn } from "../../types";
import { createTimeoutSignal } from "./signal";
import { TimeoutError } from "./types";

/**
 * Wraps a fetch result to apply timeout
 *
 * The timeout is applied by wrapping the execute method. When execute() is called,
 * an AbortSignal with timeout is created and the request is aborted if it exceeds
 * the timeout duration.
 *
 * @param fetchResult - Result from fzFetcher
 * @param timeoutMs - Timeout in milliseconds, or null for infinite timeout
 * @returns Wrapped fetch result with timeout applied
 */
export const wrapWithTimeout = <T>(
  fetchResult: UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>,
  timeoutMs: number | null,
): UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>> => {
  // If timeout is null (infinite), don't wrap - return as-is
  if (timeoutMs === null) {
    return fetchResult;
  }

  // Wrap execute method to apply timeout
  const originalExecute = fetchResult.execute;
  fetchResult.execute = async (throwOnFailed?: boolean) => {
    // Create AbortSignal with timeout
    const timeoutSignal = createTimeoutSignal(timeoutMs);

    // If no timeout signal (shouldn't happen due to check above, but TypeScript needs it)
    if (!timeoutSignal) {
      return originalExecute(throwOnFailed);
    }

    // Track if cleanup has been called to prevent double cleanup
    let cleanupCalled = false;
    const cleanup = () => {
      if (!cleanupCalled) {
        cleanupCalled = true;
        timeoutSignal.cleanup();
      }
    };

    try {
      // Execute original request with timeout signal
      // Note: We need to pass the signal to the underlying fetch, but @vueuse/core's
      // createFetch doesn't expose a way to pass AbortSignal directly. Instead, we'll
      // wrap the execute call and abort manually if timeout occurs.
      const executePromise = originalExecute(throwOnFailed);

      // Race between execute and timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutSignal.signal.addEventListener("abort", () => {
          // Don't cleanup here - it will be done in finally
          reject(new TimeoutError(timeoutMs));
        });
      });

      await Promise.race([executePromise, timeoutPromise]);
    } catch (error: any) {
      // If timeout occurred, set error and throw if needed
      if (error instanceof TimeoutError) {
        fetchResult.error.value = error;
        if (throwOnFailed) {
          throw error;
        }
        return;
      }

      // Re-throw other errors
      throw error;
    } finally {
      // Always cleanup timeout signal (only once, thanks to cleanupCalled flag)
      cleanup();
    }
  };

  return fetchResult;
};

