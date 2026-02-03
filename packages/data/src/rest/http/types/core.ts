import type { ShallowRef, MaybeRefOrGetter } from "vue";
import type { UseFetchOptions } from "@vueuse/core";

/**
 * Options for useFzFetch function
 */
export interface UseFzFetchOptions extends UseFetchOptions {
  /**
   * Will automatically run fetch when `useFetch` is used
   *
   * @default true
   */
  immediate?: boolean;

  /**
   * Will automatically refetch when:
   * - the URL is changed if the URL is a ref
   * - the payload is changed if the payload is a ref
   *
   * @default false
   */
  refetch?: MaybeRefOrGetter<boolean>;

  /**
   * Initial data before the request finished
   *
   * @default null
   */
  initialData?: unknown;

  /**
   * Enable request deduplication for this specific request
   *
   * When enabled, identical requests (same URL + query + payload + method)
   * made simultaneously will be deduplicated - only the first one executes,
   * others wait for and share the same result.
   *
   * @default undefined (uses global deduplication setting)
   */
  deduplication?: boolean;
}

/**
 * Parameters for useFzFetch function
 *
 * Query param values can be null; undefined means "omit from request".
 * Null is sent to the server as the string "null".
 * body and headers support MaybeRefOrGetter so they are re-evaluated on each execute().
 */
export interface UseFzFetchParams {
  queryParams?: MaybeRefOrGetter<Record<string, string | number | boolean | null>>;
  /** Request body. Reactive: re-evaluated on each execute(). */
  body?: MaybeRefOrGetter<BodyInit | null>;
  /** Request headers. Reactive: re-evaluated on each execute(). */
  headers?: MaybeRefOrGetter<Record<string, string>>;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
}

/**
 * Return type for useFzFetch function
 */
export interface UseFzFetchReturn<T> {
  /**
   * The statusCode of the HTTP fetch response
   */
  statusCode: ShallowRef<number | null>;
  /**
   * The raw response of the fetch response
   */
  response: ShallowRef<Response | null>;
  /**
   * Any fetch errors that may have occurred
   */
  error: ShallowRef<Error | null>;
  /**
   * The fetch response body on success, may either be JSON or text
   */
  data: ShallowRef<T | null>;
  /**
   * Indicates if the request is currently being fetched.
   */
  isFetching: Readonly<ShallowRef<boolean>>;

  /**
   * Manually call the fetch
   * (default not throwing error)
   */
  execute: (throwOnFailed?: boolean) => Promise<void>;
}

/**
 * Main useFzFetch function interface
 */
export interface UseFzFetch {
  <T>(
    url: MaybeRefOrGetter<string>,
  ): UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>;
  <T>(
    url: MaybeRefOrGetter<string>,
    UseFzFetchOptions: UseFzFetchOptions,
  ): UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>;
  <T>(
    url: MaybeRefOrGetter<string>,
    options: UseFzFetchParams,
    UseFzFetchOptions?: UseFzFetchOptions,
  ): UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>;
}
