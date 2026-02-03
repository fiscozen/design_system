import type { MaybeRefOrGetter } from "vue";
import type { UseFzFetchOptions, UseFzFetchReturn } from "../types";

/**
 * Context information passed to wrappers during application
 */
export interface WrapperContext {
  /** Request URL (can be reactive) */
  url: MaybeRefOrGetter<string>;
  /** Request configuration (mutated by params resolver before each execute) */
  requestInit: RequestInit;
  /** HTTP method */
  method: string;
  /** Request body (reactive; for params resolver and deduplication key) */
  body?: MaybeRefOrGetter<BodyInit | null | undefined>;
  /** Request headers (reactive; for params resolver) */
  headers?: MaybeRefOrGetter<Record<string, string> | undefined>;
  /** Optional useFetchOptions */
  useFetchOptions?: UseFzFetchOptions;
}

/**
 * Interface for wrapper implementations
 *
 * Wrappers modify fetch results to add functionality like interceptors, deduplication, etc.
 * They are applied in sequence, with each wrapper receiving the result from the previous one.
 */
export interface Wrapper<T = unknown> {
  /**
   * Wraps a fetch result with additional functionality
   *
   * @param fetchResult - Fetch result from previous wrapper or base fetch
   * @param context - Context information about the request
   * @returns Wrapped fetch result
   */
  wrap(
    fetchResult: UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>,
    context: WrapperContext,
  ): UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>;
}
