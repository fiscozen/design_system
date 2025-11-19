import type {
  UseFzFetch,
  UseFzFetchOptions,
  UseFzFetchParams,
  UseFzFetchReturn,
} from "./types";
import { toValue, type MaybeRefOrGetter, computed } from "vue";
import { state } from "./setup/state";
import { getUrlWithQueryParams } from "./utils/url";
import { injectCsrfToken } from "./utils/csrf";
import { normalizeUseFzFetchOptions } from "./utils/options";
import { DEFAULT_HTTP_METHOD } from "./common";
import { WrapperChain } from "./wrappers/chain";
import {
  requestInterceptorWrapper,
  responseInterceptorWrapper,
  deduplicationWrapper,
} from "./wrappers/adapters";
import type { WrapperContext } from "./wrappers/types";

// Re-export setup functions
export { setupFzFetcher, resetFzFetcher } from "./setup";

// Re-export getters for backward compatibility
export { getCsrfOptions, getGlobalDebug as getDebug } from "./setup/state";

/**
 * Creates a wrapper chain with default wrappers
 *
 * Wrappers are applied in order:
 * 1. Request interceptor (first to intercept before fetch)
 * 2. Response interceptor
 * 3. Deduplication (last to wrap the interceptor logic)
 *
 * @returns Configured wrapper chain
 */
const createDefaultWrapperChain = (): WrapperChain => {
  const chain = new WrapperChain();
  chain.add(requestInterceptorWrapper);
  chain.add(responseInterceptorWrapper);
  chain.add(deduplicationWrapper);
  return chain;
};

/**
 * Creates a fetch result with all wrappers applied
 *
 * Uses a wrapper chain to apply request interceptor, response interceptor,
 * and deduplication wrapper in the correct order.
 *
 * @param finalUrl - Computed URL for the request (can be reactive via ref/computed)
 * @param requestInit - Request configuration
 * @param method - HTTP method
 * @param body - Request body (for deduplication key)
 * @param useFetchOptions - Optional useFetchOptions for fzFetcher and interceptors
 * @returns Wrapped fetch result with all interceptors and deduplication applied
 */
const createFetchResult = <T>(
  finalUrl: MaybeRefOrGetter<string>,
  requestInit: RequestInit,
  method: string,
  body: BodyInit | null | undefined,
  useFetchOptions?: UseFzFetchOptions,
): UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>> => {
  // Create base fetch result
  const baseFetchResult = state.fzFetcher!<T>(
    finalUrl,
    requestInit,
    useFetchOptions ? normalizeUseFzFetchOptions(useFetchOptions) : undefined,
  ).json();

  // Create wrapper context
  const context: WrapperContext = {
    url: finalUrl,
    requestInit,
    method,
    body,
    useFetchOptions,
  };

  // Apply wrappers using chain
  const wrapperChain = createDefaultWrapperChain();
  return wrapperChain.apply(baseFetchResult, context);
};


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
  if (!state.fzFetcher) {
    throw new Error("FzFetcher not initialized! Use setupFzFetcher first.");
  }

  // Case 3: All 3 parameters (useFetchOptions present)
  if (useFetchOptions !== undefined) {
    const params = paramsOrUseFetchOptions as UseFzFetchParams;
    const method = params?.method || DEFAULT_HTTP_METHOD;
    const finalUrl = computed(() =>
      getUrlWithQueryParams(toValue(basePath), params.queryParams),
    );
    const requestInit = {
      method,
      body: params?.body,
      headers: injectCsrfToken(method, params?.headers),
    };

    return createFetchResult<T>(
      finalUrl,
      requestInit,
      method,
      params?.body,
      useFetchOptions,
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

      return createFetchResult<T>(
        finalUrl,
        requestInit,
        method,
        params.body,
        undefined,
      );
    } else {
      // It's UseFzFetchOptions
      const useFetchOptionsForThis = paramsOrUseFetchOptions as UseFzFetchOptions;
      const finalUrl = computed(() =>
        getUrlWithQueryParams(toValue(basePath), undefined),
      );
      const method = DEFAULT_HTTP_METHOD;
      const requestInit = {
        method,
        headers: injectCsrfToken(method, {}),
      };

      return createFetchResult<T>(
        finalUrl,
        requestInit,
        method,
        null,
        useFetchOptionsForThis,
      );
    }
  }

  // Case 1: Only basePath - keep URL reactivity
  const finalUrl = computed(() =>
    getUrlWithQueryParams(toValue(basePath), undefined),
  );
  const method = DEFAULT_HTTP_METHOD;
  const requestInit = {
    method,
    headers: injectCsrfToken(method, {}),
  };

  return createFetchResult<T>(
    finalUrl,
    requestInit,
    method,
    null,
    undefined,
  );
};
