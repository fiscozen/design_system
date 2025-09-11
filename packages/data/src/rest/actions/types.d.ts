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
export interface AllActionParams {
    filters?: Record<string, string | number | boolean>;
    sort?: Record<string, 'asc' | 'desc'>;
    page?: number;
    pageSize?: number;
}

export interface UseAllActionReturn<T> extends UseActionReturn<T> {
    /**
     * The retrieved data
     */
    data: ShallowRef<Array<T> | null>;
    /*filters?: ShallowRef<Record<string, any>>;
    sort?: ShallowRef<Record<string, 'asc' | 'desc'>>;
    page?: ShallowRef<number>;
    pageSize?: ShallowRef<number>;*/
}

export interface UseAllAction<T> {
    (): UseAllActionReturn<T>;
    (paramsOrOptions: AllActionParams | UseActionOptions): UseAllActionReturn<T>;
    (paramsOrOptions: AllActionParams, options: UseActionOptions): UseAllActionReturn<T>;
}
// --------------------------------------------------------

// USE ACTIONS
interface UseActionsReturn<T> {
    useRetrieve: UseRetrieveAction<T>;
    useAll: UseAllAction<T>;
}

export interface UseActions {
    <T>(basePath: string): UseActionsReturn<T>;
}
// --------------------------------------------------------