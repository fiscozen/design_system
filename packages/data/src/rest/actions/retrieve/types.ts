import type { ShallowRef, MaybeRefOrGetter } from "vue";
import type { QueryActionOptions, QueryActionReturn } from "../shared/types";

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
    options?: QueryActionOptions<T>,
  ): UseRetrieveActionReturn<T>;
}
