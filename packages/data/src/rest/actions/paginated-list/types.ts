import type { ShallowRef, Reactive, ComputedRef } from "vue";
import type { QueryActionOptions, QueryActionReturn } from "../shared/types";
import type {
  UseListActionParams,
  PaginationParams,
  FilterParams,
  SortParams,
} from "../list/types";

/**
 * Paginated response format from API
 */
export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
  pages: number;
  page: number;
  [key: string]: unknown;
}

/**
 * Metadata extracted from paginated response
 */
export interface PaginationMeta {
  /**
   * Total number of items across all pages
   */
  count: number;

  /**
   * Total number of pages
   */
  pages: number;

  /**
   * Current page (1-indexed, from API response)
   */
  page: number;
}

/**
 * Options for usePaginatedList (second argument when present).
 *
 * Extends QueryActionOptions with dataKey and enableSingleOrdering.
 */
export interface UsePaginatedListActionOptions<T>
  extends QueryActionOptions<PaginatedResponse<T>> {
  /**
   * Key name in the paginated response that contains the data array
   *
   * @default 'results'
   *
   * @example
   * // API returns { items: [...], count: 100, pages: 10 }
   * usePaginatedList('users', { dataKey: 'items' })
   */
  dataKey?: string;

  /**
   * Enable single ordering mode
   *
   * When `true`, only one column can be ordered at a time. Changing ordering on a column
   * will reset all other ordering columns.
   * When `false` (default), multiple columns can be ordered simultaneously.
   *
   * @default false
   *
   * @example
   * usePaginatedList('users', { enableSingleOrdering: true })
   */
  enableSingleOrdering?: boolean;
}

/**
 * Params for usePaginatedList (same as UseListActionParams)
 */
export type UsePaginatedListActionParams = UseListActionParams;

/**
 * Return type for usePaginatedList
 *
 * Extends UseListActionReturn with paginated response handling and meta.
 */
export interface UsePaginatedListActionReturn<T>
  extends Omit<QueryActionReturn<T[]>, "data"> {
  /**
   * The data array extracted from paginated response (e.g., results)
   */
  data: ShallowRef<T[] | null>;

  /**
   * Pagination metadata extracted from API response
   */
  meta: ComputedRef<PaginationMeta | null>;

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

  /**
   * Helper function to change the page
   *
   * Updates pagination.page which will trigger automatic refetch if autoUpdate is enabled.
   *
   * @param page - Page number to navigate to (1-indexed)
   *
   * @example
   * handlePageChange(2) // Navigate to page 2
   */
  handlePageChange: (page: number) => void;

  /**
   * Helper function to change the ordering
   *
   * Updates the ordering array based on enableSingleOrdering option:
   * - If enableSingleOrdering is false: adds or updates the ordering for the specified column
   * - If enableSingleOrdering is true: resets all other orderings and sets only this column
   *
   * The change will trigger automatic refetch if autoUpdate is enabled.
   * Setting direction to 'none' removes the ordering for that column.
   *
   * @param column - Column object with field name
   * @param direction - Ordering direction ('asc', 'desc', or 'none')
   *
   * @example
   * handleOrderingChange({ field: 'name' }, 'asc') // Order by name ascending
   * handleOrderingChange({ field: 'name' }, 'none') // Remove ordering for name
   */
  handleOrderingChange: (
    column: { field: string },
    direction: "asc" | "desc" | "none",
  ) => void;
}

/**
 * First argument of usePaginatedList when present (params or options).
 * @default T = unknown
 */
export type UsePaginatedListActionParamsOrOptions<T = unknown> =
  | UsePaginatedListActionParams
  | UsePaginatedListActionOptions<T>;

/**
 * Paginated list action signature (same overloads as useList)
 */
export interface UsePaginatedListAction<T> {
  (): UsePaginatedListActionReturn<T>;
  (
    paramsOrOptions: UsePaginatedListActionParamsOrOptions<T>,
  ): UsePaginatedListActionReturn<T>;
  (
    params: UsePaginatedListActionParams,
    options: UsePaginatedListActionOptions<T>,
  ): UsePaginatedListActionReturn<T>;
}
