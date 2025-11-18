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

    /**
     * Request timeout in milliseconds
     * 
     * If the request takes longer than this value, it will be aborted.
     * Note: null for infinite timeout is handled at wrapper level, not here.
     * Can be overridden per-action via QueryActionOptions.timeout or MutationActionOptions.timeout
     * 
     * @default undefined (uses global timeout setting)
     */
    timeout?: number;
}

/**
 * Parameters for useFzFetch function
 */
export interface UseFzFetchParams {
  queryParams?: MaybeRefOrGetter<Record<string, string | number | boolean>>;
  body?: BodyInit | null;
  headers?: Record<string, string>;
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

  /* -------------------------------------------------------- */

  /**
   * Indicates if the fetch request has finished
   */
  // isFinished: Readonly<ShallowRef<boolean>>;

  /**
   * Indicates if the fetch request is able to be aborted
   */
  // canAbort: ComputedRef<boolean>;

  /**
   * Indicates if the fetch request was aborted
   */
  // aborted: ShallowRef<boolean>;

  /**
   * Abort the fetch request
   */
  // abort: (reason?: any) => void;

  /*
    get: () => UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>;
    post: (payload?: MaybeRefOrGetter<unknown>, type?: string) => UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>;
    put: (payload?: MaybeRefOrGetter<unknown>, type?: string) => UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>;
    delete: (payload?: MaybeRefOrGetter<unknown>, type?: string) => UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>;
    patch: (payload?: MaybeRefOrGetter<unknown>, type?: string) => UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>;
    head: (payload?: MaybeRefOrGetter<unknown>, type?: string) => UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>;
    options: (payload?: MaybeRefOrGetter<unknown>, type?: string) => UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>;
    json: <JSON = any>() => UseFzFetchReturn<JSON> & PromiseLike<UseFzFetchReturn<JSON>>;
    text: () => UseFzFetchReturn<string> & PromiseLike<UseFzFetchReturn<string>>;
    blob: () => UseFzFetchReturn<Blob> & PromiseLike<UseFzFetchReturn<Blob>>;
    arrayBuffer: () => UseFzFetchReturn<ArrayBuffer> & PromiseLike<UseFzFetchReturn<ArrayBuffer>>;
    formData: () => UseFzFetchReturn<FormData> & PromiseLike<UseFzFetchReturn<FormData>>;
    */
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

