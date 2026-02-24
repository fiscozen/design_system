import { watch } from "vue";
import type { UseFzFetchReturn } from "../../types";
import { isEmptyResponseStatus } from "./predicate";

/**
 * Normalizes 204 No Content and 205 Reset Content responses so that
 * data and error are set to null instead of leaving error set by VueUse
 * (which treats empty body as a parse error).
 *
 * Applied as the innermost wrapper so the base fetch result is normalized
 * for both direct use and when used as one-off in params resolver (sync
 * then applies the same rule when copying state).
 */
export const wrapWithEmptyResponseNormalizer = <T>(
  fetchResult: UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>,
): UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>> => {
  watch(
    [
      () => fetchResult.statusCode.value,
      () => fetchResult.error.value,
      () => fetchResult.data.value,
    ],
    () => {
      const status = fetchResult.statusCode.value;
      if (isEmptyResponseStatus(status)) {
        fetchResult.data.value = null;
        fetchResult.error.value = null;
      }
    },
    { immediate: true, flush: "sync" },
  );
  return fetchResult;
};
