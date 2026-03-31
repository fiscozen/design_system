import { shallowRef, watch, type ShallowRef } from "vue";
import type { UseFzFetchReturn } from "../types";

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
