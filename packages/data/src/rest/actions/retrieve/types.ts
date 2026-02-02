import type { MaybeRefOrGetter } from "vue";
import type { QueryActionOptions, QueryActionReturn } from "../shared/types";

/**
 * Options for useRetrieve. Alias for QueryActionOptions for consistent naming.
 * @default T = unknown
 */
export type UseRetrieveActionOptions<T = unknown> = QueryActionOptions<T>;

/**
 * Return type for useRetrieve action
 */
export interface UseRetrieveActionReturn<T> extends QueryActionReturn<T> {}

/**
 * Retrieve a single entity by primary key
 */
export interface UseRetrieveAction<T> {
  (
    pk?: MaybeRefOrGetter<string | number>,
    options?: UseRetrieveActionOptions<T>,
  ): UseRetrieveActionReturn<T>;
}
