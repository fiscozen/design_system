import type { ShallowRef, MaybeRefOrGetter } from 'vue';

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

export interface RetrieveAction<T> {
    (pk?: MaybeRefOrGetter<string | number>, options?: UseActionOptions): UseActionReturn<T>;
}

export interface AllAction<T> {
    (options?: UseActionOptions): UseActionReturn<T>;
}

interface UseActionsReturn<T> {
    useRetrieve: RetrieveAction<T>;
    useAll: AllAction<T>;
}

export interface UseActions {
    <T>(basePath: string): UseActionsReturn<T>;
}