import type { UseFzFetchReturn } from "../types";
import type { Wrapper, WrapperContext } from "./types";
import { wrapWithParamsResolver } from "../features/params-resolver/wrapper";
import { wrapWithRequestInterceptor } from "../features/interceptors/request";
import { wrapWithResponseInterceptor } from "../features/interceptors/response";
import { wrapWithDeduplication } from "../features/deduplication/wrapper";
import { state } from "../setup/state";

/**
 * Wrapper adapter for params resolver (reactive body and headers).
 * Added last to the chain so it is outermost and runs first on execute(),
 * ensuring requestInit is updated with current body/headers before the request interceptor runs.
 */
export const paramsResolverWrapper: Wrapper = {
  wrap<T>(
    fetchResult: UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>,
    context: WrapperContext,
  ): UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>> {
    return wrapWithParamsResolver(
      fetchResult,
      context.requestInit,
      context.method,
      context.url,
      context.body,
      context.headers,
      context.useFetchOptions,
    );
  },
};

/**
 * Wrapper adapter for request interceptor
 */
export const requestInterceptorWrapper: Wrapper = {
  wrap<T>(
    fetchResult: UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>,
    context: WrapperContext,
  ): UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>> {
    return wrapWithRequestInterceptor(
      fetchResult,
      context.url,
      context.requestInit,
      context.useFetchOptions,
    );
  },
};

/**
 * Wrapper adapter for response interceptor
 */
export const responseInterceptorWrapper: Wrapper = {
  wrap<T>(
    fetchResult: UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>,
    context: WrapperContext,
  ): UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>> {
    return wrapWithResponseInterceptor(
      fetchResult,
      context.url,
      context.requestInit,
    );
  },
};

/**
 * Wrapper adapter for deduplication
 *
 * Only applies if deduplication is enabled (globally or per-request).
 */
export const deduplicationWrapper: Wrapper = {
  wrap<T>(
    fetchResult: UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>,
    context: WrapperContext,
  ): UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>> {
    // Determine if deduplication should be enabled
    const deduplicationEnabled =
      context.useFetchOptions?.deduplication !== undefined
        ? context.useFetchOptions.deduplication
        : state.globalDeduplication;

    // When body is reactive we use context.body; when static we use requestInit.body for the deduplication key
    const bodyForDedup =
      context.body !== undefined ? context.body : () => context.requestInit.body;
    return wrapWithDeduplication(
      fetchResult,
      context.url,
      context.method,
      bodyForDedup,
      deduplicationEnabled,
    );
  },
};
