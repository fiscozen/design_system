import type { ShallowRef, MaybeRefOrGetter } from 'vue';

// USE ACTION
interface UseActionReturn<T> {
    /**
     * Any errors that may have occurred
     */
    error: ShallowRef<any>;
    
    /**
     * The retrieved data
     */
    data: ShallowRef<T | null>;

    /**
     * Indicates if the action is currently being executed.
     */
    isLoading: Readonly<ShallowRef<boolean>>;
    
    /**
     * Manually execute the action
     */
    execute: () => Promise<any>;
}

export interface UseActionOptions {
    /**
     * Will automatically run the action
     *
     * @default true
     */
    onMount?: boolean;

    /**
     * Will automatically run the action when a ref is changed
     *
     * @default false
     */
    autoUpdate?: MaybeRefOrGetter<boolean>;

    /**
     * Initial data
     *
     * @default null
     */
    initialData?: any;
}
// --------------------------------------------------------

// RETRIEVE ACTION
export interface UseRetrieveActionReturn<T> extends UseActionReturn<T> {}

export interface UseRetrieveAction<T> {
    (pk?: MaybeRefOrGetter<string | number>, options?: UseActionOptions): UseRetrieveActionReturn<T>;
}
// --------------------------------------------------------

// ALL ACTION
export interface ListActionParams {
    filters?: Record<string, string | number | boolean>;
    sort?: Record<string, 'asc' | 'desc'>;
    page?: number;
    pageSize?: number;
}

export interface ListActionReturn<T> extends UseActionReturn<T> {
    /**
     * The retrieved data
     */
    data: ShallowRef<Array<T> | null>;
    /*filters?: ShallowRef<Record<string, any>>;
    sort?: ShallowRef<Record<string, 'asc' | 'desc'>>;
    page?: ShallowRef<number>;
    pageSize?: ShallowRef<number>;*/
}

export interface UseListAction<T> {
    (): ListActionReturn<T>;
    (paramsOrOptions: ListActionParams | UseActionOptions): ListActionReturn<T>;
    (paramsOrOptions: ListActionParams, options: UseActionOptions): ListActionReturn<T>;
}
// --------------------------------------------------------

// USE ACTIONS
interface UseActionsReturn<T> {
    useRetrieve: UseRetrieveAction<T>;
    useList: UseListAction<T>;
}

export interface UseActions {
    <T>(basePath: string): UseActionsReturn<T>;
}
// --------------------------------------------------------