import { shallowRef, watch, type ShallowRef } from "vue";
import { until } from "@vueuse/core";
import type { UseFzFetchReturn } from "../types";

type FetchResult<T> = UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>;

/**
 * VueUse state flags as they exist at runtime. `isFinished` is not part of
 * UseFzFetchReturn, but it is what `await fetchResult` waits on.
 */
interface FetchFlags {
  isFetching: Readonly<ShallowRef<boolean>>;
  isFinished: Readonly<ShallowRef<boolean>>;
}

/**
 * Returns a writable ref that follows `source` synchronously and can also be
 * written directly.
 */
const writableMirror = (
  source: Readonly<ShallowRef<boolean>>,
): ShallowRef<boolean> => {
  const mirror = shallowRef(source.value);
  watch(
    () => source.value,
    (value) => {
      mirror.value = value;
    },
    { flush: "sync" },
  );
  return mirror;
};

/**
 * Replaces VueUse's readonly isFetching and isFinished with writable mirrors, and
 * rebinds then() to the writable isFinished.
 *
 * VueUse v13+ wraps both flags with readonly(), and its then() waits on its private
 * isFinished, which only a request run by that same VueUse instance can set. A request
 * served by a separate fetch (request interceptor that changes the request, reactive
 * body or headers) or by none (interceptor that aborts or throws) would otherwise
 * leave `await fetchResult`, and any async function returning fetchResult, pending
 * for ever.
 *
 * The awaited value is fetchResult without then(), so resolving with it terminates.
 */
export const makeFetchStateWritable = <T>(
  fetchResult: FetchResult<T>,
): FetchResult<T> => {
  const flags = fetchResult as unknown as FetchFlags;
  const isFinished = writableMirror(flags.isFinished);

  const then: FetchResult<T>["then"] = (onFulfilled, onRejected) => {
    const settled: UseFzFetchReturn<T> & { then?: undefined } = { ...fetchResult, then: undefined };
    return until(isFinished)
      .toBe(true)
      .then(() => settled)
      .then(onFulfilled, onRejected);
  };

  Object.assign(fetchResult, {
    isFetching: writableMirror(flags.isFetching),
    isFinished,
    then,
  });
  return fetchResult;
};

/**
 * Wraps execute() so isFinished is false while the latest call runs and true once
 * it settles, whichever fetch served it, or none.
 *
 * Must wrap the outermost execute(): the wrappers below it may never call VueUse's
 * own execute(), which is the only code that sets isFinished otherwise. A call that
 * settles after a newer one has started leaves isFinished alone, as VueUse does.
 */
export const trackFinishedOnExecute = <T>(fetchResult: FetchResult<T>): void => {
  const { isFinished } = fetchResult as unknown as { isFinished: ShallowRef<boolean> };
  const execute = fetchResult.execute;
  let latestCall = 0;

  fetchResult.execute = async (throwOnFailed?: boolean) => {
    latestCall += 1;
    const call = latestCall;
    isFinished.value = false;
    try {
      await execute(throwOnFailed);
    } finally {
      if (call === latestCall) {
        isFinished.value = true;
      }
    }
  };
};
