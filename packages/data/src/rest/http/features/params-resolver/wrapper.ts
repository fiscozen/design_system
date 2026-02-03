import { toValue, nextTick, type MaybeRefOrGetter } from "vue";
import type { UseFzFetchReturn, UseFzFetchOptions } from "../../types";
import { state } from "../../setup/state";
import { injectCsrfToken } from "../../utils/csrf";
import { handleFetchError } from "../../utils/error";
import { wrapWithDeduplication } from "../deduplication/wrapper";
import {
  createModifiedFetchRequest,
  syncFetchResultState,
  waitForFetchCompletion,
  applyResponseInterceptorAndReparse,
  handleAbortedRequest,
} from "../interceptors/request";

/**
 * Wraps execute() to resolve reactive body and headers and run a one-off fetch with current values.
 *
 * useFzFetch accepts MaybeRefOrGetter for body and headers. The base fetcher (VueUse useFetch)
 * does not re-read requestInit on execute(), so mutating requestInit is not enough. We create
 * a new fetch with the current requestInit on each execute() and sync state back to fetchResult.
 *
 * To preserve deduplication, the one-off fetch is wrapped with wrapWithDeduplication before
 * calling execute(), so identical in-flight requests still deduplicate.
 *
 * Must be the outermost wrapper (added last to the chain) so it runs first on execute()
 * and other wrappers (e.g. request interceptor) see resolved body/headers in requestInit.
 *
 * @param fetchResult - Result from fzFetcher or previous wrapper
 * @param requestInit - Base request config (method, etc.); per execute() we build a copy with current body/headers
 * @param method - HTTP method
 * @param url - Request URL (MaybeRefOrGetter)
 * @param bodyGetter - Optional reactive body
 * @param headersGetter - Optional reactive headers
 * @param useFetchOptions - Optional fetch options for the one-off fetch and deduplication
 * @returns Same fetch result with execute() wrapped
 */
export const wrapWithParamsResolver = <T>(
  fetchResult: UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>,
  requestInit: RequestInit,
  method: string,
  url: MaybeRefOrGetter<string>,
  bodyGetter?: MaybeRefOrGetter<BodyInit | null | undefined>,
  headersGetter?: MaybeRefOrGetter<Record<string, string> | undefined>,
  useFetchOptions?: UseFzFetchOptions,
): UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>> => {
  if (bodyGetter === undefined && headersGetter === undefined) {
    return fetchResult;
  }

  // Track current watch so we can clean it up when execute() is called multiple times rapidly.
  let currentWatch: (() => void) | null = null;

  fetchResult.execute = async (throwOnFailed?: boolean) => {
    if (currentWatch) {
      currentWatch();
      currentWatch = null;
    }

    // Build a per-call request config so concurrent execute() calls don't share mutable state.
    // If we mutated the shared requestInit and the interceptor is async, a second call could
    // overwrite body/headers before the first interceptor resumes and read wrong values.
    const bodyValue =
      bodyGetter !== undefined ? toValue(bodyGetter) ?? undefined : requestInit.body;
    const headersValue =
      headersGetter !== undefined
        ? injectCsrfToken(method, toValue(headersGetter) ?? {})
        : requestInit.headers;

    const requestInitForThisCall: RequestInit = {
      ...requestInit,
      body: bodyValue,
      headers: headersValue,
    };

    const urlString = toValue(url);
    let requestToUse: RequestInit = requestInitForThisCall;

    if (state.globalRequestInterceptor) {
      const intercepted = await state.globalRequestInterceptor(
        urlString,
        requestInitForThisCall,
      );
      if (intercepted === null) {
        handleAbortedRequest(fetchResult, urlString, throwOnFailed);
        return;
      }
      requestToUse = intercepted;
    }

    const oneOff = createModifiedFetchRequest<T>(
      urlString,
      requestToUse,
      useFetchOptions,
    );
    const unwatchSync = syncFetchResultState(oneOff, fetchResult);
    currentWatch = unwatchSync;

    const clearCurrentWatchIfSame = (watcherToCleanup: () => void): void => {
      if (currentWatch === watcherToCleanup) {
        currentWatch = null;
      }
    };

    const deduplicationEnabled =
      useFetchOptions?.deduplication !== undefined
        ? useFetchOptions.deduplication
        : state.globalDeduplication;
    const oneOffWithDedup = wrapWithDeduplication(
      oneOff as UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>,
      () => urlString,
      method,
      () => bodyValue,
      deduplicationEnabled,
    );

    try {
      await oneOffWithDedup.execute(throwOnFailed);

      const shouldContinue = await applyResponseInterceptorAndReparse(
        oneOff,
        fetchResult,
        urlString,
        requestToUse,
        throwOnFailed,
        unwatchSync,
        clearCurrentWatchIfSame,
      );
      if (!shouldContinue) {
        return;
      }
    } catch (error: unknown) {
      await waitForFetchCompletion(oneOff);
      nextTick(() => {
        unwatchSync();
        clearCurrentWatchIfSame(unwatchSync);
      });
      handleFetchError(fetchResult.error, error, throwOnFailed);
      return;
    }

    await waitForFetchCompletion(oneOff);
    nextTick(() => {
      unwatchSync();
      clearCurrentWatchIfSame(unwatchSync);
    });
  };

  return fetchResult;
};
