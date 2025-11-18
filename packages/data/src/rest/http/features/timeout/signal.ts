import { state } from "../../setup/state";

/**
 * Creates an AbortSignal with timeout
 *
 * Uses AbortSignal.timeout() if available (modern browsers), otherwise
 * falls back to AbortController with setTimeout.
 * If timeoutMs is null, returns null (no timeout applied).
 *
 * @param timeoutMs - Timeout in milliseconds, or null for infinite timeout
 * @returns Object with signal and cleanup function, or null if timeout is infinite
 */
export const createTimeoutSignal = (
  timeoutMs: number | null,
): { signal: AbortSignal; cleanup: () => void } | null => {
  // If timeout is null, return null (no timeout applied)
  if (timeoutMs === null) {
    if (state.globalDebug) {
      console.debug("[useFzFetch] No timeout applied (infinite timeout)");
    }
    return null;
  }

  // Use AbortSignal.timeout() if available (simpler and more efficient)
  if (typeof AbortSignal !== "undefined" && "timeout" in AbortSignal) {
    const signal = AbortSignal.timeout(timeoutMs);
    if (state.globalDebug) {
      console.debug(
        `[useFzFetch] Using AbortSignal.timeout(${timeoutMs}ms)`,
      );
    }
    return {
      signal,
      cleanup: () => {
        // AbortSignal.timeout() doesn't need manual cleanup
      },
    };
  }

  // Fallback to AbortController with setTimeout
  const abortController = new AbortController();
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  timeoutId = setTimeout(() => {
    abortController.abort();
    if (state.globalDebug) {
      console.debug(
        `[useFzFetch] Request timeout after ${timeoutMs}ms`,
      );
    }
  }, timeoutMs);

  const cleanup = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return { signal: abortController.signal, cleanup };
};

