import { reactive, toValue, watch } from "vue";
import { useFzFetch } from "../../http";
import type { UseListAction, ListActionParams, PaginationParams, FilterParams, SortParams } from "./types";
import type { UseActionOptions } from "../shared/types";
import { normalizeOptions, normalizeParams, normalizeListResponse } from "../shared/normalize";

/**
 * Create a list action for fetching multiple entities with filters, sorting, and pagination
 *
 * Supports multiple overloads:
 * - useList() - No params, no options
 * - useList(options) - Options only
 * - useList(params) - Params only
 * - useList(params, options) - Both params and options
 *
 * Returns reactive objects (filters, sort, pagination) that can be modified directly.
 * When autoUpdate is true, changes to these reactive objects trigger automatic refetch.
 *
 * **Pagination Defaults:**
 * If `pagination` is provided (even if empty), default values are applied:
 * - `page`: defaults to `1` if not specified
 * - `pageSize`: defaults to `50` if not specified
 *
 * @param basePath - Base API path for the resource
 * @param paramsOrOptions - Either ListActionParams or UseActionOptions
 * @param options - Optional UseActionOptions (when params are provided)
 * @returns ListActionReturn with data, error, isLoading, execute, filters, sort, pagination
 */
export const createListAction = <T>(
  basePath: string,
  paramsOrOptions?: ListActionParams | UseActionOptions,
  options?: UseActionOptions,
): ReturnType<UseListAction<T>> => {
  // Extract initial values and create reactive objects
  const initialFilters = paramsOrOptions && "filters" in paramsOrOptions
    ? toValue((paramsOrOptions as ListActionParams).filters) || {}
    : {};
  const initialSort = paramsOrOptions && "sort" in paramsOrOptions
    ? toValue((paramsOrOptions as ListActionParams).sort) || []
    : [];
  const hasPagination = paramsOrOptions && "pagination" in paramsOrOptions;
  const initialPagination = hasPagination
    ? toValue((paramsOrOptions as ListActionParams).pagination) || {}
    : {};

  // Create reactive objects for direct modification
  const filters = reactive<FilterParams>({ ...initialFilters });
  const sort = reactive<SortParams>([...initialSort]);
  // Apply defaults (page: 1, pageSize: 50) if pagination is provided (even if empty)
  // Filter out undefined values to prevent them from overriding defaults
  const pagination = reactive<PaginationParams>(
    hasPagination
      ? {
          page: initialPagination.page !== undefined ? initialPagination.page : 1,
          pageSize: initialPagination.pageSize !== undefined ? initialPagination.pageSize : 50,
        }
      : {}
  );

  // Extract throwOnError from options or paramsOrOptions
  const throwOnError = options !== undefined
    ? options.throwOnError ?? false
    : paramsOrOptions && !("filters" in paramsOrOptions || "sort" in paramsOrOptions || "pagination" in paramsOrOptions)
    ? (paramsOrOptions as UseActionOptions).throwOnError ?? false
    : false;

  // Create useFzFetch with reactive params
  const normalizedOptions = options !== undefined
    ? normalizeOptions(options)
    : paramsOrOptions && !("filters" in paramsOrOptions || "sort" in paramsOrOptions || "pagination" in paramsOrOptions)
    ? normalizeOptions(paramsOrOptions as UseActionOptions)
    : normalizeOptions({});

  const response = useFzFetch<T[]>(
    `${basePath}`,
    normalizeParams({ filters, sort, pagination }),
    normalizedOptions,
  );

  // Watch reactive objects for changes and trigger refetch if autoUpdate is enabled
  const autoUpdate = toValue(normalizedOptions.refetch ?? true);
  if (autoUpdate) {
    // Use a flag to prevent race conditions when params change rapidly
    let isExecuting = false;
    watch(
      [filters, sort, pagination],
      async () => {
        // Prevent duplicate requests if already executing or fetching
        if (isExecuting || response.isFetching.value) {
          return;
        }
        isExecuting = true;
        try {
          await response.execute(throwOnError);
        } finally {
          isExecuting = false;
        }
      },
      { deep: true, immediate: false }
    );
  }

  // Return normalized response with reactive objects
  const normalized = normalizeListResponse<T>(response, throwOnError);
  return {
    ...normalized,
    filters,
    sort,
    pagination,
  } as ReturnType<UseListAction<T>>;
};

