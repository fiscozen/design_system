import { watch } from "vue";
import type { UseFzFetchReturn } from "../../types";

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
  private pendingRequests: Map<
    string,
    UseFzFetchReturn<any>
  > = new Map();

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
    const normalizedUrl = this.normalizeUrl(url);

    // Normalize body (sort keys if JSON)
    const normalizedBody = this.normalizeBody(body);

    return `${method}:${normalizedUrl}:${normalizedBody}`;
  }

  /**
   * Normalizes URL by removing trailing slashes and sorting query parameters
   *
   * @param url - Request URL
   * @returns Normalized URL string
   */
  private normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url, window.location.origin);
      // Sort query parameters
      const sortedParams = Array.from(urlObj.searchParams.entries())
        .sort(([a], [b]) => a.localeCompare(b));
      urlObj.search = "";
      sortedParams.forEach(([key, value]) => {
        urlObj.searchParams.append(key, value);
      });
      // Remove trailing slash from pathname
      const pathname = urlObj.pathname.replace(/\/$/, "");
      return `${pathname}${urlObj.search}`;
    } catch {
      // If URL parsing fails, return as-is
      return url;
    }
  }

  /**
   * Normalizes request body by sorting JSON keys
   *
   * @param body - Request body string
   * @returns Normalized body string
   */
  private normalizeBody(body?: string | null): string {
    if (!body) {
      return "";
    }

    try {
      const parsed = JSON.parse(body);
      return JSON.stringify(parsed, Object.keys(parsed).sort());
    } catch {
      // If not JSON, return as-is
      return body;
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
   * Registers a pending request
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
          // Request completed, clean up after a short delay to allow
          // other pending requests to access the result
          setTimeout(() => {
            this.pendingRequests.delete(key);
            unwatch();
          }, 100);
        }
      },
      { immediate: true },
    );
  }

  /**
   * Clears all pending requests (useful for testing)
   */
  clear(): void {
    this.pendingRequests.clear();
  }
}

