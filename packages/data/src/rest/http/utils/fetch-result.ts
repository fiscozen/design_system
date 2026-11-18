import { computed, shallowRef, watch, type ShallowRef } from "vue";
import { until } from "@vueuse/core";
import type { UseFzFetchReturn } from "../types";

type FetchResult<T> = UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>;

/**
 * VueUse's own request flags. `isFinished` is not part of UseFzFetchReturn, but VueUse
 * sets it on the object, and its then() waits on it.
 */
export interface VueUseFlags {
  isFetching: Readonly<ShallowRef<boolean>>;
  isFinished: Readonly<ShallowRef<boolean>>;
}

/**
 * Replaces VueUse's readonly isFetching with a writable ShallowRef.
 *
 * VueUse v13+ wraps isFetching with readonly(), preventing external sync
 * (e.g. params resolver, request interceptor one-off fetch).
 * This utility creates a writable ref and keeps it in sync with VueUse's
 * internal state via a flush:'sync' watcher, so both direct VueUse updates
 * (Path A) and external sync writes (Path B) work correctly.
 */
export const makeIsFetchingWritable = <T>(
  fetchResult: UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>,
): UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>> => {
  const originalIsFetching = fetchResult.isFetching;
  const writableIsFetching: ShallowRef<boolean> = shallowRef(
    originalIsFetching.value,
  );

  watch(
    () => originalIsFetching.value,
    (val) => {
      writableIsFetching.value = val;
    },
    { flush: "sync" },
  );

  (fetchResult as unknown as Record<string, unknown>).isFetching =
    writableIsFetching;
  return fetchResult;
};

/**
 * Returns VueUse's own isFetching and isFinished. Call it before makeIsFetchingWritable,
 * which replaces isFetching on the object.
 */
export const readVueUseFlags = <T>(fetchResult: FetchResult<T>): VueUseFlags => {
  const { isFetching, isFinished } = fetchResult as unknown as VueUseFlags;
  return { isFetching, isFinished };
};

/**
 * Makes isFinished and then() follow the outermost execute() as well as the requests
 * VueUse starts on its own, such as a refetch on a URL change.
 *
 * The wrappers can serve execute() from a separate fetch, or from none, and VueUse's
 * isFinished, which its then() waits on, never turns true for those. isFinished is true
 * once a request has finished and none is running: neither the latest execute() nor a
 * VueUse request. An execute() that settles after a newer one started changes nothing.
 *
 * Must wrap the outermost execute(). The awaited value is fetchResult without then(),
 * so resolving with it terminates.
 */
export const trackSettlement = <T>(
  fetchResult: FetchResult<T>,
  vueUse: VueUseFlags,
): void => {
  const executeRunning = shallowRef(false);
  const executeSettled = shallowRef(false);
  const isFinished = computed(() => {
    const isRunning = executeRunning.value || vueUse.isFetching.value;
    const hasFinishedOnce = executeSettled.value || vueUse.isFinished.value;
    return hasFinishedOnce && !isRunning;
  });

  const execute = fetchResult.execute;
  let latestCall = 0;
  fetchResult.execute = async (throwOnFailed?: boolean) => {
    latestCall += 1;
    const call = latestCall;
    executeRunning.value = true;
    try {
      await execute(throwOnFailed);
    } finally {
      if (call === latestCall) {
        executeRunning.value = false;
        executeSettled.value = true;
      }
    }
  };

  const then: FetchResult<T>["then"] = (onFulfilled, onRejected) => {
    const settled: UseFzFetchReturn<T> & { then?: undefined } = { ...fetchResult, then: undefined };
    return until(isFinished)
      .toBe(true)
      .then(() => settled)
      .then(onFulfilled, onRejected);
  };
  Object.assign(fetchResult, { isFinished, then });
};
