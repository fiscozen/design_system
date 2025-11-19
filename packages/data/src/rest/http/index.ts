import type {
  UseFzFetch,
  UseFzFetchOptions,
  UseFzFetchParams,
} from "./types";
import { toValue, type MaybeRefOrGetter, computed } from "vue";
import { state } from "./setup/state";
import { getUrlWithQueryParams } from "./utils/url";
import { injectCsrfToken } from "./utils/csrf";
import { normalizeUseFzFetchOptions } from "./utils/options";
import { DEFAULT_HTTP_METHOD } from "./common";
import {
  wrapWithTimeout,
  resolveTimeout,
  TimeoutError,
} from "./features/timeout";
import {
  wrapWithRequestInterceptor,
  wrapWithResponseInterceptor,
} from "./features/interceptors";
import { wrapWithDeduplication } from "./features/deduplication/wrapper";

// Re-export setup functions
export { setupFzFetcher, resetFzFetcher } from "./setup";

// Re-export getters for backward compatibility
export { getCsrfOptions, getGlobalDebug as getDebug } from "./setup/state";

/**
 * Determines if deduplication should be enabled for a request
 *
 * @param perActionDeduplication - Per-action deduplication setting
 * @returns True if deduplication should be enabled
 */
const shouldDeduplicate = (
  perActionDeduplication?: boolean,
): boolean => {
  // Per-action setting takes precedence
  if (perActionDeduplication !== undefined) {
    return perActionDeduplication;
  }
  // Fall back to global setting
  return state.globalDeduplication;
};


// Re-export TimeoutError for backward compatibility
export { TimeoutError } from "./features/timeout";


/**
 * HTTP wrapper with reactive URL support and CSRF auto-injection
 *
 * Built on top of `@vueuse/core`'s `createFetch`, this function provides:
 * - Reactive URLs (automatically refetches when computed URLs change)
 * - CSRF token auto-injection for mutation methods (POST/PUT/PATCH/DELETE)
 * - Query parameter merging
 * - TypeScript overloads for different use cases
 *
 * @param basePath - Base URL path (can be reactive via ref/computed)
 * @param paramsOrUseFetchOptions - Either UseFzFetchParams or UseFzFetchOptions
 * @param useFetchOptions - Additional fetch options (when params are provided)
 * @returns Object with data, error, isLoading, execute
 *
 * @example
 * // Simple GET request
 * const { data, error, isLoading } = useFzFetch<User>('/users/1')
 *
 * @example
 * // POST request with body
 * const { data, execute } = useFzFetch<User>('/users', {
 *   method: 'POST',
 *   body: JSON.stringify({ name: 'John' }),
 *   headers: { 'Content-Type': 'application/json' }
 * })
 * await execute()
 *
 * @example
 * // Reactive URL
 * const userId = ref(1)
 * const url = computed(() => `/users/${userId.value}`)
 * const { data } = useFzFetch<User>(url) // Auto-refetches when userId changes
 *
 * @example
 * // With query parameters
 * const { data } = useFzFetch<User[]>('/users', {
 *   queryParams: { role: 'admin', active: true }
 * })
 * // Requests: /users?role=admin&active=true
 */
export const useFzFetch: UseFzFetch = <T>(
  basePath: MaybeRefOrGetter<string>,
  paramsOrUseFetchOptions?: UseFzFetchParams | UseFzFetchOptions,
  useFetchOptions?: UseFzFetchOptions,
) => {
  if (state.fzFetcher) {
    // Case 3: All 3 parameters (useFetchOptions present)
    if (useFetchOptions !== undefined) {
      // Determine deduplication setting for this case
      const deduplicationEnabled = shouldDeduplicate(
        useFetchOptions.deduplication,
      );

      // Resolve timeout for this case (per-action → global → default)
      const timeoutMs = resolveTimeout(useFetchOptions.timeout);
      const params = paramsOrUseFetchOptions as UseFzFetchParams;
      const method = params?.method || DEFAULT_HTTP_METHOD;

      // Keep basePath reactive and create reactive finalUrl if needed
      const finalUrl = computed(() =>
        getUrlWithQueryParams(toValue(basePath), params.queryParams),
      );
      const requestInit = {
        method,
        body: params?.body,
        headers: injectCsrfToken(method, params?.headers),
      };
      let fetchResult = state.fzFetcher<T>(
        finalUrl,
        requestInit,
        normalizeUseFzFetchOptions(useFetchOptions),
      ).json();
      
      // Apply request interceptor wrapper (must be first to intercept before fetch)
      fetchResult = wrapWithRequestInterceptor(
        fetchResult,
        finalUrl,
        requestInit,
        useFetchOptions,
      ) as typeof fetchResult;
      
      // Apply timeout wrapper
      fetchResult = wrapWithTimeout(fetchResult, timeoutMs) as typeof fetchResult;
      
      // Apply response interceptor wrapper
      fetchResult = wrapWithResponseInterceptor(
        fetchResult,
        finalUrl,
        requestInit,
      ) as typeof fetchResult;
      
      // Apply deduplication wrapper (must be last to wrap the interceptor logic)
      return wrapWithDeduplication(
        fetchResult,
        finalUrl,
        method,
        params?.body,
        deduplicationEnabled,
      );
    }

    // Case 2: basePath + second parameter (useFetchOptions absent)
    if (paramsOrUseFetchOptions !== undefined) {
      // Distinguish between UseFzFetchParams and UseFzFetchOptions
      if (
        "queryParams" in paramsOrUseFetchOptions ||
        "method" in paramsOrUseFetchOptions ||
        "body" in paramsOrUseFetchOptions
      ) {
        // It's UseFzFetchParams
        // Determine deduplication setting for this case (use global default)
        const deduplicationEnabled = shouldDeduplicate(undefined);

        // Resolve timeout for this case (use global default)
        const timeoutMs = resolveTimeout(undefined);

        const params = paramsOrUseFetchOptions as UseFzFetchParams;
        const method = params.method || DEFAULT_HTTP_METHOD;

        const finalUrl = computed(() =>
          getUrlWithQueryParams(toValue(basePath), params.queryParams),
        );
        const requestInit = {
          method,
          body: params.body,
          headers: injectCsrfToken(method, params.headers),
        };
        let fetchResult = state.fzFetcher<T>(finalUrl, requestInit).json();
        
        // Apply request interceptor wrapper (must be first to intercept before fetch)
        fetchResult = wrapWithRequestInterceptor(
          fetchResult,
          finalUrl,
          requestInit,
          undefined, // No useFetchOptions in this case
        ) as typeof fetchResult;
        
        // Apply timeout wrapper (use global timeout)
        fetchResult = wrapWithTimeout(fetchResult, timeoutMs) as typeof fetchResult;
        
        // Apply response interceptor wrapper
        fetchResult = wrapWithResponseInterceptor(
          fetchResult,
          finalUrl,
          requestInit,
        ) as typeof fetchResult;
        
        // Apply deduplication wrapper (must be last to wrap the interceptor logic)
        return wrapWithDeduplication(
          fetchResult,
          finalUrl,
          method,
          params.body,
          deduplicationEnabled,
        );
      } else {
        // It's UseFzFetchOptions
        const finalUrl = computed(() =>
          getUrlWithQueryParams(toValue(basePath), undefined),
        );
        const method = DEFAULT_HTTP_METHOD;
        const requestInit = {
          method,
          headers: injectCsrfToken(method, {}),
        };
        const deduplicationEnabledForThis = shouldDeduplicate(
          (paramsOrUseFetchOptions as UseFzFetchOptions).deduplication,
        );
        const timeoutForThis = resolveTimeout(
          (paramsOrUseFetchOptions as UseFzFetchOptions).timeout,
        );
        const useFetchOptionsForThis = paramsOrUseFetchOptions as UseFzFetchOptions;
        let fetchResult = state.fzFetcher<T>(
          finalUrl,
          requestInit,
          normalizeUseFzFetchOptions(useFetchOptionsForThis),
        ).json();
        
        // Apply request interceptor wrapper (must be first to intercept before fetch)
        fetchResult = wrapWithRequestInterceptor(
          fetchResult,
          finalUrl,
          requestInit,
          useFetchOptionsForThis,
        ) as typeof fetchResult;
        
        // Apply timeout wrapper
        fetchResult = wrapWithTimeout(fetchResult, timeoutForThis) as typeof fetchResult;
        
        // Apply response interceptor wrapper
        fetchResult = wrapWithResponseInterceptor(
          fetchResult,
          finalUrl,
          requestInit,
        ) as typeof fetchResult;
        
        // Apply deduplication wrapper (must be last to wrap the interceptor logic)
        return wrapWithDeduplication(
          fetchResult,
          finalUrl,
          method,
          null,
          deduplicationEnabledForThis,
        );
      }
    }

    // Case 1: Only basePath - keep URL reactivity
    // Determine deduplication setting for this case (use global default)
    const deduplicationEnabled = shouldDeduplicate(undefined);

    // Resolve timeout for this case (use global default)
    const timeoutMs = resolveTimeout(undefined);

    const finalUrl = computed(() =>
      getUrlWithQueryParams(toValue(basePath), undefined),
    );
    const method = "GET";
    const requestInit = {
      method,
      headers: injectCsrfToken(method, {}),
    };
    let fetchResult = state.fzFetcher<T>(finalUrl, requestInit).json();
    
    // Apply request interceptor wrapper (must be first to intercept before fetch)
    fetchResult = wrapWithRequestInterceptor(
      fetchResult,
      finalUrl,
      requestInit,
    ) as typeof fetchResult;
    
    // Apply timeout wrapper (use global timeout)
    fetchResult = wrapWithTimeout(fetchResult, timeoutMs) as typeof fetchResult;
    
    // Apply response interceptor wrapper
    fetchResult = wrapWithResponseInterceptor(
      fetchResult,
      finalUrl,
      requestInit,
    ) as typeof fetchResult;
    
    // Apply deduplication wrapper (must be last to wrap the interceptor logic)
    return wrapWithDeduplication(
      fetchResult,
      finalUrl,
      method,
      null,
      deduplicationEnabled,
    );
  } else {
    throw new Error("FzFetcher not initialized! Use setupFzFetcher first.");
  }
};
