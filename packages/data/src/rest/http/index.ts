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
  paramsResolverWrapper,
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
 * 1. Params resolver (resolves reactive body/headers into requestInit before each execute)
 * 2. Request interceptor
 * 3. Response interceptor
 * 4. Deduplication
 *
 * @returns Configured wrapper chain
 */
const createDefaultWrapperChain = (): WrapperChain => {
  const chain = new WrapperChain();
  chain.add(paramsResolverWrapper);
  chain.add(requestInterceptorWrapper);
  chain.add(responseInterceptorWrapper);
  chain.add(deduplicationWrapper);
  return chain;
};

/**
 * Creates a fetch result with all wrappers applied
 *
 * Uses a wrapper chain to apply params resolver, request interceptor, response interceptor,
 * and deduplication wrapper in the correct order.
 *
 * bodyGetter and headersGetter are optional; when provided they are re-evaluated on each
 * execute() by the params resolver so body and headers stay reactive.
 *
 * **Important**: If interceptors are configured or reactive body/headers are provided,
 * we disable `immediate` in the base fetch so the first request goes through the
 * wrapper chain (params resolver, interceptors). We then call `execute()` manually if
 * the user requested immediate execution.
 *
 * @param finalUrl - Computed URL for the request (can be reactive via ref/computed)
 * @param requestInit - Request configuration (initial values; mutated by params resolver when getters provided)
 * @param method - HTTP method
 * @param bodyGetter - Optional reactive body (re-evaluated on each execute)
 * @param headersGetter - Optional reactive headers (re-evaluated on each execute)
 * @param useFetchOptions - Optional useFetchOptions for fzFetcher and interceptors
 * @returns Wrapped fetch result with all wrappers applied
 */
const createFetchResult = <T>(
  finalUrl: MaybeRefOrGetter<string>,
  requestInit: RequestInit,
  method: string,
  bodyGetter?: MaybeRefOrGetter<BodyInit | null | undefined>,
  headersGetter?: MaybeRefOrGetter<Record<string, string> | undefined>,
  useFetchOptions?: UseFzFetchOptions,
): UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>> => {
  // Check if interceptors are configured
  const hasInterceptors =
    state.globalRequestInterceptor || state.globalResponseInterceptor;

  // Reactive body/headers are resolved by paramsResolverWrapper on each execute().
  // If we don't disable immediate, VueUse runs the first request before the wrapper chain
  // is applied, bypassing the params resolver and using initial requestInit only.
  const hasReactiveParams =
    bodyGetter !== undefined || headersGetter !== undefined;

  const mustDisableImmediate = hasInterceptors || hasReactiveParams;
  const shouldExecuteImmediate =
    mustDisableImmediate && (useFetchOptions?.immediate ?? true);

  // Disable immediate when interceptors or reactive params are present so the first
  // request goes through the wrapper chain; we call execute() manually after wrapping.
  const baseFetchOptions = useFetchOptions
    ? {
        ...normalizeUseFzFetchOptions(useFetchOptions),
        immediate: mustDisableImmediate ? false : useFetchOptions.immediate,
      }
    : mustDisableImmediate
      ? { immediate: false }
      : undefined;

  const baseFetchResult = state.fzFetcher!<T>(
    finalUrl,
    requestInit,
    baseFetchOptions,
  ).json();

  // Create wrapper context (body/headers as getters for params resolver and deduplication)
  const context: WrapperContext = {
    url: finalUrl,
    requestInit,
    method,
    body: bodyGetter,
    headers: headersGetter,
    useFetchOptions,
  };

  // Apply wrappers using chain
  const wrapperChain = createDefaultWrapperChain();
  const wrappedResult = wrapperChain.apply(baseFetchResult, context);

  // If we disabled immediate (interceptors or reactive params) and user wanted immediate,
  // run execute() once so the first request goes through the wrapper chain
  if (shouldExecuteImmediate) {
    // Use nextTick to ensure all reactive setup is complete
    Promise.resolve().then(() => {
      wrappedResult.execute().catch(() => {
        // Errors are already handled in execute() and stored in error.value
        // We just need to catch to prevent unhandled promise rejection
      });
    });
  }

  return wrappedResult;
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
 *
 * @example
 * // Reactive body and headers (re-evaluated on each execute())
 * const payload = ref({ name: 'John' })
 * const headers = ref({ 'Content-Type': 'application/json' })
 * const { execute } = useFzFetch<User>('/users', {
 *   method: 'POST',
 *   body: computed(() => JSON.stringify(payload.value)),
 *   headers,
 * }, { immediate: false })
 * await execute() // uses current payload and headers
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
      body:
        params?.body !== undefined ? toValue(params.body) : undefined,
      headers: injectCsrfToken(
        method,
        params?.headers !== undefined ? toValue(params.headers ?? {}) : {},
      ),
    };

    return createFetchResult<T>(
      finalUrl,
      requestInit,
      method,
      params?.body,
      params?.headers,
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
        body: params.body !== undefined ? toValue(params.body) : undefined,
        headers: injectCsrfToken(
          method,
          params.headers !== undefined ? toValue(params.headers ?? {}) : {},
        ),
      };

      return createFetchResult<T>(
        finalUrl,
        requestInit,
        method,
        params.body,
        params.headers,
        undefined,
      );
    } else {
      // It's UseFzFetchOptions
      const useFetchOptionsForThis =
        paramsOrUseFetchOptions as UseFzFetchOptions;
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
        undefined,
        undefined,
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
    undefined,
    undefined,
    undefined,
  );
};
