import type { MaybeRefOrGetter } from "vue";
import type { UseFzFetchOptions, UseFzFetchReturn } from "../types";

/**
 * Context information passed to wrappers during application
 */
export interface WrapperContext {
  /** Request URL (can be reactive) */
  url: MaybeRefOrGetter<string>;
  /** Request configuration */
  requestInit: RequestInit;
  /** HTTP method */
  method: string;
  /** Request body (for deduplication key) */
  body: BodyInit | null | undefined;
  /** Optional useFetchOptions */
  useFetchOptions?: UseFzFetchOptions;
}

/**
 * Interface for wrapper implementations
 *
 * Wrappers modify fetch results to add functionality like interceptors, deduplication, etc.
 * They are applied in sequence, with each wrapper receiving the result from the previous one.
 */
export interface Wrapper<T = any> {
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

