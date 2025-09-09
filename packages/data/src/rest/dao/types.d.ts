import type { ShallowRef, ComputedRef, MaybeRefOrGetter } from 'vue'

interface UseFzFetchOptions {
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
    initialData?: any;

    // TODO: add interceptors
    // TODO: add error handling
}

interface UseFzFetchReturn<T> {
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
    error: ShallowRef<any>;
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
    execute: (throwOnFailed?: boolean) => Promise<any>;

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

export interface UseFzFetch {
    <T>(url: MaybeRefOrGetter<string>): UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>
    <T>(url: MaybeRefOrGetter<string>, UseFzFetchOptions: UseFzFetchOptions): UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>
    <T>(url: MaybeRefOrGetter<string>, options: RequestInit, UseFzFetchOptions?: UseFzFetchOptions): UseFzFetchReturn<T> & PromiseLike<UseFzFetchReturn<T>>
}

/**
 * Setup the fzFetcher options
 */
interface SetupFzFetcherOptions {
    /**
     * The base URL that will be prefixed to all urls unless urls are absolute
     */
    baseUrl?: MaybeRefOrGetter<string>;
    
    /**
     * Default Options for the useFzFetch function
     */
    options?: UseFzFetchOptions;

    /**
     * Options for the fetch request
     */
    fetchOptions?: RequestInit;
}

/**
 * Setup the fzFetcher instance
 */
export interface SetupFzFetcher {
    (options: SetupFzFetcherOptions): void
}