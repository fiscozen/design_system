import type { MaybeRefOrGetter } from "vue";
import type { UseFzFetchOptions } from "./core";
import type { CsrfOptions } from "../managers/csrf/types";
import type {
  RequestInterceptor,
  ResponseInterceptor,
} from "../features/interceptors/types";

/**
 * Setup the fzFetcher options
 */
export interface SetupFzFetcherOptions {
  /**
   * The base URL that will be prefixed to all urls unless urls are absolute
   *
   * @required
   */
  baseUrl: MaybeRefOrGetter<string>;

  /**
   * Default Options for the useFzFetch function
   */
  options?: UseFzFetchOptions;

  /**
   * Options for the fetch request
   */
  fetchOptions?: RequestInit;

  /**
   * CSRF protection configuration
   */
  csrf?: CsrfOptions;

  /**
   * Enable debug logging (console.debug)
   * @default false
   */
  debug?: boolean;

  /**
   * Enable request deduplication globally
   *
   * When enabled, identical requests (same URL + query + payload + method)
   * made simultaneously will be deduplicated - only the first one executes,
   * others wait for and share the same result.
   *
   * Can be overridden per-action via UseFzFetchOptions.deduplication
   *
   * @default false
   */
  deduplication?: boolean;

  /**
   * Normalize trailing slash on the path of every request URL.
   * Only the path (before ? or #) is modified; query and fragment are preserved.
   *
   * - `true`: ensure path always ends with /
   * - `false`: ensure path never ends with /
   * - `null` / `undefined`: do not modify the URL
   *
   * Per-request override (UseFzFetchOptions.trailingSlash): omit = use this value;
   * `null` = no normalization for that request; `true`/`false` = override for that request.
   *
   * @default undefined (no normalization)
   */
  trailingSlash?: true | false | null;

  /**
   * Debounce delay in milliseconds for autoUpdate watch in list actions
   *
   * When autoUpdate is enabled, changes to filters, ordering, or pagination
   * trigger automatic refetch. This delay groups rapid changes together to
   * prevent duplicate requests.
   *
   * @default 100
   *
   * @example
   * // Disable debounce (not recommended)
   * autoUpdateDebounceDelay: 0
   *
   * @example
   * // Increase debounce for slower networks
   * autoUpdateDebounceDelay: 200
   */
  autoUpdateDebounceDelay?: number;

  /**
   * Request interceptor function
   *
   * Called before each request is sent. Can modify the request (URL, headers, body, etc.)
   * or abort it by returning null.
   *
   * @example
   * requestInterceptor: async (url, requestInit) => {
   *   // Add custom header
   *   return {
   *     ...requestInit,
   *     headers: { ...requestInit.headers, 'X-Custom': 'value' }
   *   }
   * }
   */
  requestInterceptor?: RequestInterceptor;

  /**
   * Response interceptor function
   *
   * Called after each response is received. Can modify the response or handle errors.
   *
   * @example
   * responseInterceptor: async (response, url, requestInit) => {
   *   // Transform response
   *   if (response.status === 401) {
   *     // Handle unauthorized
   *     throw new Error('Unauthorized')
   *   }
   *   return response
   * }
   */
  responseInterceptor?: ResponseInterceptor;
}

/**
 * Setup the fzFetcher instance
 */
export interface SetupFzFetcher {
  (options: SetupFzFetcherOptions): void;
}
