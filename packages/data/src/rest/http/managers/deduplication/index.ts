import { watch, nextTick } from "vue";
import type { UseFzFetchReturn } from "../../types";
import { NON_JSON_BODY_PREFIX_LENGTH } from "../../config";
import { normalizeUrlForDeduplication } from "../../utils/url";

/**
 * Manages request deduplication to prevent duplicate identical requests
 *
 * When multiple identical requests are made simultaneously, only the first one
 * is executed. Subsequent requests wait for the first one to complete and share
 * the same result.
 *
 * @internal
 */
export class DeduplicationManager {
  private pendingRequests: Map<string, UseFzFetchReturn<unknown>> = new Map();

  private pendingWatches: Map<string, () => void> = new Map();

  /**
   * Base URL for resolving relative URLs during normalization
   *
   * Passed explicitly to avoid circular dependency with state module.
   * If not provided, relative URLs will be normalized without base URL.
   */
  private readonly baseUrl: string | null;

  constructor(baseUrl?: string | null) {
    this.baseUrl = baseUrl ?? null;
  }

  /**
   * Generates a unique key for a request based on URL, query params, payload, and method
   *
   * @param url - Request URL
   * @param method - HTTP method
   * @param body - Request body (if any)
   * @returns Unique key string
   */
  private generateKey(
    url: string,
    method: string,
    body?: string | null,
  ): string {
    // Normalize URL (remove trailing slashes, sort query params)
    const normalizedUrl = normalizeUrlForDeduplication(url, this.baseUrl);

    // Normalize body (sort keys if JSON)
    const normalizedBody = this.normalizeBody(body);

    return `${method}:${normalizedUrl}:${normalizedBody}`;
  }

  /**
   * Recursively normalizes a JSON value by sorting object keys at all levels
   *
   * This function ensures that identical JSON structures with different key
   * ordering produce the same normalized string. It handles:
   * - Objects: sorts keys recursively
   * - Arrays: normalizes each element recursively
   * - Primitives: returns as-is
   *
   * @param value - JSON value to normalize (object, array, or primitive)
   * @returns Normalized value with all keys sorted
   */
  private normalizeJsonValue(value: unknown): unknown {
    // Handle null and primitives (string, number, boolean, undefined)
    if (value === null || typeof value !== "object") {
      return value;
    }

    // Handle arrays: normalize each element recursively
    if (Array.isArray(value)) {
      return value.map((item) => this.normalizeJsonValue(item));
    }

    // Handle objects: sort keys and normalize values recursively
    const sortedEntries = Object.entries(value)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, val]) => [key, this.normalizeJsonValue(val)]);

    return Object.fromEntries(sortedEntries);
  }

  /**
   * Normalizes request body by sorting JSON keys
   *
   * For JSON bodies, recursively sorts object keys at all levels to ensure
   * consistent comparison. For non-JSON bodies, creates an identifier using
   * length and prefix.
   *
   * **Limitation**: Non-JSON bodies with the same length and prefix will be
   * considered identical for deduplication purposes. This is acceptable for
   * most use cases since:
   * - JSON bodies are fully compared (no collisions)
   * - Non-JSON body collisions are rare in practice
   * - The deduplication key includes URL, method, and headers, reducing collision risk
   *
   * @param body - Request body string
   * @returns Normalized body string
   */
  private normalizeBody(body?: string | null): string {
    if (!body) {
      return "";
    }

    try {
      // Parse and normalize JSON by recursively sorting keys at all levels
      const parsed = JSON.parse(body);
      const normalized = this.normalizeJsonValue(parsed);
      return JSON.stringify(normalized);
    } catch {
      // If not JSON, create identifier using length and prefix
      // This approach balances uniqueness with performance (no hash computation needed)
      // Collisions are possible but rare in practice, especially combined with URL/method/headers
      const prefix = body.substring(0, NON_JSON_BODY_PREFIX_LENGTH);
      return `non-json:${body.length}:${prefix}`;
    }
  }

  /**
   * Checks if a request is already pending
   *
   * @param url - Request URL
   * @param method - HTTP method
   * @param body - Request body (if any)
   * @returns UseFzFetchReturn if request is pending, null otherwise
   */
  getPendingRequest<T>(
    url: string,
    method: string,
    body?: string | null,
  ): UseFzFetchReturn<T> | null {
    const key = this.generateKey(url, method, body);
    return (this.pendingRequests.get(key) as UseFzFetchReturn<T>) || null;
  }

  /**
   * Cleans up a pending request and its watch
   *
   * Removes the request from pendingRequests map and stops watching.
   * This method is idempotent - safe to call multiple times.
   *
   * @param key - Request key to clean up
   */
  private cleanupRequest(key: string): void {
    // Remove from pending requests
    this.pendingRequests.delete(key);

    // Stop watching and remove from pending watches
    const watchCleanup = this.pendingWatches.get(key);
    if (watchCleanup) {
      watchCleanup();
      this.pendingWatches.delete(key);
    }
  }

  /**
   * Registers a pending request
   *
   * Sets up automatic cleanup when the request completes (success or error).
   * Uses watch to detect when isFetching becomes false and cleans up immediately.
   *
   * @param url - Request URL
   * @param method - HTTP method
   * @param body - Request body (if any)
   * @param fetchResult - UseFzFetchReturn for the request
   */
  registerPendingRequest<T>(
    url: string,
    method: string,
    body: string | null | undefined,
    fetchResult: UseFzFetchReturn<T>,
  ): void {
    const key = this.generateKey(url, method, body);
    this.pendingRequests.set(key, fetchResult);

    // Clean up when request completes (success or error)
    // We watch the isFetching state to detect completion
    const unwatch = watch(
      () => fetchResult.isFetching.value,
      (isFetching: boolean) => {
        if (!isFetching) {
          // Request completed, clean up after nextTick to allow
          // other pending requests to sync state before cleanup
          // This ensures deduplicated requests can access the result
          nextTick(() => {
            this.cleanupRequest(key);
          });
        }
      },
      { immediate: true },
    );

    // Store watch cleanup function for explicit cleanup (e.g., in clear())
    this.pendingWatches.set(key, unwatch);
  }

  /**
   * Clears all pending requests and their watches (useful for testing)
   */
  clear(): void {
    // Clean up all watches
    this.pendingWatches.forEach((unwatch) => unwatch());
    this.pendingWatches.clear();
    this.pendingRequests.clear();
  }
}
