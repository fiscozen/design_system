import type { UseFzFetchReturn } from "../types";
import type { Wrapper, WrapperContext } from "./types";
import { wrapWithRequestInterceptor } from "../features/interceptors/request";
import { wrapWithResponseInterceptor } from "../features/interceptors/response";
import { wrapWithDeduplication } from "../features/deduplication/wrapper";
import { state } from "../setup/state";

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

    return wrapWithDeduplication(
      fetchResult,
      context.url,
      context.method,
      context.body,
      deduplicationEnabled,
    );
  },
};

