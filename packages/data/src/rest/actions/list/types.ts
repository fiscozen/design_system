import type { ShallowRef, MaybeRefOrGetter, Reactive } from "vue";
import type { QueryActionOptions, QueryActionReturn } from "../shared/types";

/**
 * Filter parameters
 *
 * Key-value pairs where keys are filter field names and values can be
 * string, number, boolean, null, or undefined.
 *
 * **Query semantics:** `undefined` = omit from request (e.g. remove a default filter);
 * `null` = send to the server (query param present with value null).
 */
export type FilterParams = Record<
  string,
  string | number | boolean | null | undefined
>;

/**
 * Ordering parameters
 *
 * Array of objects where each object represents an ordering field and direction.
 * Multiple ordering fields can be specified by adding multiple objects to the array.
 * Values with direction 'none' are excluded from the query string.
 *
 * @example
 * [{ name: 'asc' }, { created_at: 'desc' }, { status: 'none' }]
 * Normalized to: ordering=name,-created_at (status excluded)
 */
export type SortParams = Array<Record<string, "asc" | "desc" | "none">>;

/**
 * Pagination parameters
 */
export interface PaginationParams {
  /**
   * Page number (1-indexed)
   */
  page?: number;

  /**
   * Number of items per page
   */
  pageSize?: number;
}

/**
 * Parameters for list/collection queries
 *
 * These are initial values used only for bootstrap.
 * The composable returns reactive objects that can be modified directly.
 */
export interface ListActionParams {
  /**
   * Initial filter parameters (e.g., { by_city: 'Rome', by_type: 'micro' })
   *
   * **Query semantics:** `undefined` = omit from request; `null` = send to the server.
   * Use `undefined` to remove a default filter in merge helpers; use `null` to send null to the API.
   *
   * After initialization, modify the returned `filters` reactive object directly.
   */
  filters?: MaybeRefOrGetter<FilterParams>;

  /**
   * Initial ordering parameters as array of objects (e.g., [{ name: 'asc' }, { created_at: 'desc' }])
   *
   * Normalized to query string format: `ordering=name,-created_at`
   * Descending fields are prefixed with '-' (e.g., '-created_at'), ascending fields have no prefix.
   * Values with direction 'none' are excluded from the query string.
   *
   * After initialization, modify the returned `ordering` reactive array directly.
   */
  ordering?: MaybeRefOrGetter<SortParams>;

  /**
   * Initial pagination parameters
   *
   * If provided (even if empty), default values are applied:
   * - `page`: defaults to `1` if not specified
   * - `pageSize`: defaults to `50` if not specified
   *
   * After initialization, modify the returned `pagination` reactive object directly.
   *
   * @example
   * // Empty pagination → applies defaults
   * useList({ pagination: {} })
   * // → pagination = { page: 1, pageSize: 50 }
   *
   * // Partial pagination → applies defaults for missing values
   * useList({ pagination: { page: 2 } })
   * // → pagination = { page: 2, pageSize: 50 }
   */
  pagination?: MaybeRefOrGetter<PaginationParams>;
}

/**
 * Return type for useList action
 */
export interface ListActionReturn<T>
  extends Omit<QueryActionReturn<T[]>, "data"> {
  /**
   * The response data from server (array of entities)
   */
  data: ShallowRef<T[] | null>;

  /**
   * Reactive filters object - modify directly to trigger refetch
   *
   * @example
   * filters.name = 'Paolo' // ✅ Auto-refetches (if autoUpdate: true)
   */
  filters: Reactive<FilterParams>;

  /**
   * Reactive ordering array - modify directly to trigger refetch
   *
   * @example
   * ordering.push({ created_at: 'desc' }) // ✅ Auto-refetches (if autoUpdate: true)
   */
  ordering: Reactive<SortParams>;

  /**
   * Reactive pagination object - modify directly to trigger refetch
   *
   * @example
   * pagination.page = 2 // ✅ Auto-refetches (if autoUpdate: true)
   */
  pagination: Reactive<PaginationParams>;
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
