import type { ShallowRef, MaybeRefOrGetter } from "vue";
import type { QueryActionOptions, QueryActionReturn } from "../shared/types";

/**
 * Parameters for list/collection queries
 */
export interface ListActionParams {
  /**
   * Filter parameters (e.g., { by_city: 'Rome', by_type: 'micro' })
   * 
   * Values can be `null` or `undefined` to explicitly exclude a filter from the query string.
   * These values are automatically filtered out during normalization.
   */
  filters?: MaybeRefOrGetter<Record<string, string | number | boolean | null | undefined>>;

  /**
   * Sort parameters (e.g., { name: 'asc', created_at: 'desc' })
   */
  sort?: MaybeRefOrGetter<Record<string, "asc" | "desc">>;

  /**
   * Page number for pagination
   */
  page?: MaybeRefOrGetter<number>;

  /**
   * Page size for pagination
   */
  pageSize?: MaybeRefOrGetter<number>;
}

/**
 * Return type for useList action
 */
export interface ListActionReturn<T> extends Omit<QueryActionReturn<T[]>, 'data'> {
  /**
   * The response data from server (array of entities)
   */
  data: ShallowRef<T[] | null>;
}

/**
 * List/query multiple entities with optional filters, sorting, and pagination
 */
export interface UseListAction<T> {
  (): ListActionReturn<T>;
  (
    paramsOrOptions: ListActionParams | QueryActionOptions<T[]>,
  ): ListActionReturn<T>;
  (
    params: ListActionParams,
    options: QueryActionOptions<T[]>,
  ): ListActionReturn<T>;
}

