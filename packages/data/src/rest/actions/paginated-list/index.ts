import { computed, watch } from "vue";
import type {
  UsePaginatedListAction,
  UsePaginatedListActionParams,
  UsePaginatedListActionOptions,
  PaginatedResponse,
  PaginationMeta,
} from "./types";
import type { UseActionOptions } from "../shared/types";
import type { UseFzFetchReturn } from "../../http/types";
import {
  normalizePaginatedListResponse,
  extractOptionValue,
  extractOptionsObject,
  isParamsObject,
} from "../shared/normalize";
import { createListBase } from "../shared/create-list-base";
import { DEFAULT_DATA_KEY } from "../../http/config";
import { validatePaginationValue } from "../shared/validation";

/**
 * Create a paginated list action for fetching multiple entities with filters, ordering, and pagination
 *
 * Works exactly like useList but handles paginated responses with metadata.
 *
 * Supports multiple overloads (same as useList):
 * - usePaginatedList() - No params, no options
 * - usePaginatedList(options) - Options only
 * - usePaginatedList(params) - Params only
 * - usePaginatedList(params, options) - Both params and options
 *
 * Returns reactive objects (filters, ordering, pagination) that can be modified directly.
 * When autoUpdate is true, changes to these reactive objects trigger automatic refetch.
 *
 * **Response Format:**
 * Expects API to return: `{ results: T[], count: number, next: string | null, previous: string | null, pages: number, page: number }`
 *
 * **Data Key:**
 * By default extracts data from `results` key. Use `dataKey` option to customize:
 * ```typescript
 * usePaginatedList('users', { dataKey: 'items' }) // Extracts from 'items' instead
 * ```
 *
 * **Ordering Format:**
 * Ordering is normalized to query string format: `ordering=name,-created_at`
 * Descending fields are prefixed with '-' (e.g., '-created_at'), ascending fields have no prefix.
 * Values with direction 'none' are excluded from the query string.
 *
 * **Pagination Defaults:**
 * If `pagination` is provided (even if empty), default values are applied:
 * - `page`: defaults to `1` if not specified
 * - `pageSize`: defaults to `50` if not specified
 *
 * @param basePath - Base API path for the resource
 * @param paramsOrOptions - Either UsePaginatedListActionParams or UsePaginatedListActionOptions
 * @param options - Optional UsePaginatedListActionOptions (when params are provided)
 * @returns UsePaginatedListActionReturn with data, error, isLoading, execute, meta, filters, ordering, pagination, handlePageChange, handleOrderingChange
 */
export const createPaginatedListAction = <T>(
  basePath: string,
  paramsOrOptions?: UsePaginatedListActionParams | UsePaginatedListActionOptions<T>,
  options?: UsePaginatedListActionOptions<T>,
): ReturnType<UsePaginatedListAction<T>> => {
  // Extract dataKey from options (default: 'results')
  const dataKey = extractOptionValue(
    options,
    paramsOrOptions,
    "dataKey",
    DEFAULT_DATA_KEY,
  );

  // Extract enableSingleOrdering from options (default: false)
  const enableSingleOrdering = extractOptionValue(
    options,
    paramsOrOptions,
    "enableSingleOrdering",
    false,
  );

  // Extract options without dataKey and enableSingleOrdering (pass to createListBase)
  // Use destructuring to safely exclude these properties instead of delete
  const optionsToExtract = extractOptionsObject(
    options,
    paramsOrOptions,
  ) as UsePaginatedListActionOptions<T>;

  const {
    dataKey: _dataKeyUnused,
    enableSingleOrdering: _enableSingleOrderingUnused,
    ...restOptions
  } = optionsToExtract;
  void _dataKeyUnused;
  void _enableSingleOrderingUnused;
  const listOptions: UseActionOptions = restOptions;

  // For usePaginatedList, pagination must always be present (even if empty)
  // This ensures pagination defaults (page: 1, pageSize: 50) are always applied
  // If pagination is not provided, add it as empty object so defaults are applied
  type ParamsWithPagination =
    | UsePaginatedListActionParams
    | UsePaginatedListActionOptions<T>
    | undefined;

  const paramsWithPagination: ParamsWithPagination = (() => {
    // If paramsOrOptions is a params object
    if (isParamsObject(paramsOrOptions)) {
      // If pagination already exists, use as is
      if ("pagination" in paramsOrOptions) {
        return paramsOrOptions;
      }
      // Otherwise, add empty pagination object
      return {
        ...paramsOrOptions,
        pagination: {},
      };
    }

    // paramsOrOptions is options or undefined - create params object with pagination
    return {
      ...(paramsOrOptions || {}),
      pagination: {},
    };
  })();

  // Call createListBase with PaginatedResponse<T> type
  // Define internal type that includes _rawResponse for type-safe access
  interface InternalListBaseResult {
    filters: ReturnType<typeof createListBase>["filters"];
    ordering: ReturnType<typeof createListBase>["ordering"];
    pagination: ReturnType<typeof createListBase>["pagination"];
    data: ReturnType<typeof createListBase>["data"];
    error: ReturnType<typeof createListBase>["error"];
    isLoading: ReturnType<typeof createListBase>["isLoading"];
    execute: ReturnType<typeof createListBase>["execute"];
    _rawResponse: UseFzFetchReturn<PaginatedResponse<T>>;
  }

  const baseResult = createListBase<PaginatedResponse<T>, T>(
    basePath,
    paramsWithPagination,
    listOptions,
    (response, throwOnError) =>
      normalizePaginatedListResponse<T>(response, dataKey, throwOnError),
  ) as InternalListBaseResult;

  // Extract meta from paginated response using raw response
  const meta = computed((): PaginationMeta | null => {
    const rawResponse = baseResult._rawResponse;
    if (!rawResponse) return null;

    const paginatedData = rawResponse.data.value;
    if (!paginatedData) return null;

    const response = paginatedData as PaginatedResponse<T>;

    return {
      count: response.count,
      pages: response.pages,
      page: response.page,
    };
  });

  // Helper function to safely sync pagination.page with server response
  // Prevents race conditions when multiple page requests are made in quick succession
  const syncPaginationPage = (
    serverPage: number | undefined,
    isRequestInFlight: boolean,
  ): void => {
    if (serverPage === undefined) return;

    const currentPage = baseResult.pagination.page;

    // If a request is in flight, only sync if response matches current page
    // This prevents race conditions where an older response overwrites a newer user action
    if (isRequestInFlight) {
      if (currentPage === serverPage) {
        // Response matches current request - safe to sync
        // Note: This mutation triggers the watch in create-list-base.ts, but the
        // debounce + isExecuting check prevents infinite loops
        baseResult.pagination.page = serverPage;
      }
      // Otherwise, ignore this response (it's from an older request)
      return;
    }

    // No request in flight - safe to sync normally
    // This handles cases where server returns a different page due to validation, etc.
    // Only update if different to avoid triggering unnecessary reactivity
    if (currentPage !== serverPage) {
      baseResult.pagination.page = serverPage;
    }
  };

  // Synchronize pagination.page with meta.page (server response)
  // This ensures pagination.page always reflects the actual page returned by the server
  // After each successful response, pagination.page is updated to match the server's response.page
  //
  // Race condition prevention:
  // When multiple page requests are made in quick succession, we only sync if:
  // 1. No request is in flight (safe to sync normally), OR
  // 2. A request is in flight AND the response page matches the current pagination.page
  //    (meaning this response is for the current request, not an older one)
  // This prevents older responses from overwriting newer user actions.
  //
  // We watch both meta.page and isFetching to handle cases where the watch fires
  // during request processing vs after completion.
  watch(
    [() => meta.value?.page, () => baseResult._rawResponse.isFetching.value],
    ([serverPage, isRequestInFlight]) => {
      syncPaginationPage(serverPage, isRequestInFlight);
    },
    { immediate: true },
  );

  // Helper function to change the page
  // Updates pagination.page which will trigger automatic refetch if autoUpdate is enabled
  const handlePageChange = (page: number): void => {
    try {
      validatePaginationValue(page, "page", "handlePageChange");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn(
        `[handlePageChange] ${errorMessage}. Ignoring invalid page change.`,
      );
      return;
    }
    baseResult.pagination.page = page;
    // The watch in createListBase will automatically trigger refetch if autoUpdate is enabled
  };

  // Helper function to handle multiple ordering (adds or updates ordering for column)
  const handleMultipleOrdering = (
    column: { field: string },
    direction: "asc" | "desc" | "none",
  ): void => {
    const ordering = baseResult.ordering;
    // Find existing ordering entry for this field
    const existingIndex = ordering.findIndex((item) => column.field in item);

    if (direction === "none") {
      // Remove ordering entry if direction is 'none'
      if (existingIndex !== -1) {
        ordering.splice(existingIndex, 1);
      }
    } else {
      if (existingIndex !== -1) {
        // Update existing ordering entry
        ordering[existingIndex] = { [column.field]: direction };
      } else {
        // Add new ordering entry
        ordering.push({ [column.field]: direction });
      }
    }
  };

  // Helper function to handle single ordering (resets all others, sets only this column)
  const handleSingleOrdering = (
    column: { field: string },
    direction: "asc" | "desc" | "none",
  ): void => {
    const ordering = baseResult.ordering;
    if (direction === "none") {
      // Remove ordering entry if direction is 'none'
      const existingIndex = ordering.findIndex((item) => column.field in item);
      if (existingIndex !== -1) {
        ordering.splice(existingIndex, 1);
      }
    } else {
      // Reset all other orderings by clearing the array
      ordering.length = 0;
      // Add only the new ordering entry
      ordering.push({ [column.field]: direction });
    }
  };

  // Helper function to change the ordering
  // Updates the ordering array based on enableSingleOrdering option
  const handleOrderingChange = (
    column: { field: string },
    direction: "asc" | "desc" | "none",
  ): void => {
    if (enableSingleOrdering) {
      handleSingleOrdering(column, direction);
    } else {
      handleMultipleOrdering(column, direction);
    }
    // The watch in createListBase will automatically trigger refetch if autoUpdate is enabled
  };

  // Remove _rawResponse from return (internal use only)
  // Type-safe destructuring using the InternalListBaseResult type
  const { _rawResponse: _rawResponseDropped, ...result } = baseResult;
  void _rawResponseDropped;

  return {
    ...result,
    meta,
    handlePageChange,
    handleOrderingChange,
  } as ReturnType<UsePaginatedListAction<T>>;
};
