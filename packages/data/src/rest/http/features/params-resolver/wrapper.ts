import { toValue, nextTick, type MaybeRefOrGetter } from "vue";
import type { UseFzFetchReturn, UseFzFetchOptions } from "../../types";
import { injectCsrfToken } from "../../utils/csrf";
import { handleFetchError } from "../../utils/error";
import {
  createModifiedFetchRequest,
  syncFetchResultState,
  waitForFetchCompletion,
  applyResponseInterceptorAndReparse,
} from "../interceptors/request";

/**
 * Wraps execute() to resolve reactive body and headers and run a one-off fetch with current values.
 *
 * useFzFetch accepts MaybeRefOrGetter for body and headers. The base fetcher (VueUse useFetch)
 * does not re-read requestInit on execute(), so mutating requestInit is not enough. We create
 * a new fetch with the current requestInit on each execute() and sync state back to fetchResult.
 *
 * Must run first (outermost) in the wrapper chain so other wrappers see the same execute() flow.
 *
 * @param fetchResult - Result from fzFetcher or previous wrapper
 * @param requestInit - Request config object (mutated with current body/headers before one-off fetch)
 * @param method - HTTP method
 * @param url - Request URL (MaybeRefOrGetter)
 * @param bodyGetter - Optional reactive body
 * @param headersGetter - Optional reactive headers
 * @param useFetchOptions - Optional fetch options for the one-off fetch
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

  fetchResult.execute = async (throwOnFailed?: boolean) => {
    if (bodyGetter !== undefined) {
      requestInit.body = toValue(bodyGetter) ?? undefined;
    }
    if (headersGetter !== undefined) {
      requestInit.headers = injectCsrfToken(
        method,
        toValue(headersGetter) ?? {},
      );
    }

    const urlString = toValue(url);
    const oneOff = createModifiedFetchRequest<T>(
      urlString,
      requestInit,
      useFetchOptions,
    );
    const unwatchSync = syncFetchResultState(oneOff, fetchResult);

    try {
      await oneOff.execute(throwOnFailed);

      const shouldContinue = await applyResponseInterceptorAndReparse(
        oneOff,
        fetchResult,
        urlString,
        requestInit,
        throwOnFailed,
        unwatchSync,
        () => {},
      );
      if (!shouldContinue) {
        return;
      }
    } catch (error: unknown) {
      await waitForFetchCompletion(oneOff);
      nextTick(() => unwatchSync());
      handleFetchError(fetchResult.error, error, throwOnFailed);
      return;
    }

    await waitForFetchCompletion(oneOff);
    nextTick(() => unwatchSync());
  };

  return fetchResult;
};
