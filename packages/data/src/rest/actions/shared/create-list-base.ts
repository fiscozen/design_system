import { reactive, toValue, watch } from "vue";
import { useFzFetch } from "../../http";
import type { UseFzFetchReturn } from "../../http/types";
import type { QueryActionReturn } from "./types";
import type { PaginationParams, FilterParams, SortParams } from "../list/types";
import type { UseActionOptions } from "./types";
import { normalizeOptions, normalizeParams } from "./normalize";
import { getGlobalAutoUpdateDebounceDelay } from "../../http/setup/state";

/**
 * Base function for creating list actions with configurable response type
 *
 * Extracts common logic (params extraction, reactive objects, watch, etc.)
 * and allows customizing:
 * - Response type (TResponse - e.g., T[] or PaginatedResponse<T>)
 * - Response normalization function
 *
 * @param basePath - Base API path for the resource
 * @param paramsOrOptions - Either ListActionParams or UseActionOptions
 * @param options - Optional UseActionOptions (when params are provided)
 * @param normalizeResponseFn - Function to normalize the response
 * @returns Base list action return with filters, ordering, pagination
 */
export const createListBase = <TResponse, TData>(
  basePath: string,
  paramsOrOptions: any,
  options: any,
  normalizeResponseFn: (
    response: UseFzFetchReturn<TResponse>,
    throwOnError: boolean,
  ) => QueryActionReturn<TData[]>,
) => {
  // Extract initial values and create reactive objects
  const initialFilters =
    paramsOrOptions && "filters" in paramsOrOptions
      ? toValue(paramsOrOptions.filters) || {}
      : {};
  const initialOrdering =
    paramsOrOptions && "ordering" in paramsOrOptions
      ? toValue(paramsOrOptions.ordering) || []
      : [];
  const hasPagination = paramsOrOptions && "pagination" in paramsOrOptions;
  const initialPagination = hasPagination
    ? toValue(paramsOrOptions.pagination) || {}
    : {};

  // Create reactive objects for direct modification
  const filters = reactive<FilterParams>({ ...initialFilters });
  const ordering = reactive<SortParams>([...initialOrdering]);
  // Apply defaults (page: 1, pageSize: 50) if pagination is provided (even if empty)
  // Filter out undefined values to prevent them from overriding defaults
  const pagination = reactive<PaginationParams>(
    hasPagination
      ? {
          page:
            initialPagination.page !== undefined ? initialPagination.page : 1,
          pageSize:
            initialPagination.pageSize !== undefined
              ? initialPagination.pageSize
              : 50,
        }
      : {},
  );

  // Extract throwOnError from options or paramsOrOptions
  const throwOnError =
    options !== undefined
      ? (options.throwOnError ?? false)
      : paramsOrOptions &&
          !(
            "filters" in paramsOrOptions ||
            "ordering" in paramsOrOptions ||
            "pagination" in paramsOrOptions
          )
        ? ((paramsOrOptions as UseActionOptions).throwOnError ?? false)
        : false;

  // Create useFzFetch with reactive params
  const normalizedOptions =
    options !== undefined
      ? normalizeOptions(options)
      : paramsOrOptions &&
          !(
            "filters" in paramsOrOptions ||
            "ordering" in paramsOrOptions ||
            "pagination" in paramsOrOptions
          )
        ? normalizeOptions(paramsOrOptions as UseActionOptions)
        : normalizeOptions({});

  const response = useFzFetch<TResponse>(
    `${basePath}`,
    normalizeParams({ filters, ordering, pagination }),
    normalizedOptions,
  );

  // Watch reactive objects for changes and trigger refetch if autoUpdate is enabled
  const autoUpdate = toValue(normalizedOptions.refetch ?? true);
  if (autoUpdate) {
    // Use a flag to prevent race conditions when params change rapidly
    let isExecuting = false;
    let watchTimeout: ReturnType<typeof setTimeout> | null = null;
    const debounceDelay = getGlobalAutoUpdateDebounceDelay();

    watch(
      [filters, ordering, pagination],
      async () => {
        // Prevent duplicate requests if already executing or fetching
        if (isExecuting || response.isFetching.value) {
          return;
        }

        // Cancel previous timeout if exists (debounce: group rapid changes)
        if (watchTimeout !== null) {
          clearTimeout(watchTimeout);
          watchTimeout = null;
        }

        // Debounce: wait for debounceDelay before executing
        // If more changes arrive during this time, cancel and restart
        watchTimeout = setTimeout(async () => {
          isExecuting = true;
          watchTimeout = null; // Reset timeout reference
          try {
            await response.execute(throwOnError);
          } finally {
            isExecuting = false;
          }
        }, debounceDelay);
      },
      { deep: true, immediate: false },
    );
  }

  // Return normalized response with reactive objects
  const normalized = normalizeResponseFn(response, throwOnError);
  return {
    ...normalized,
    filters,
    ordering,
    pagination,
    // Expose raw response for advanced use cases (e.g., extracting meta from paginated responses)
    _rawResponse: response,
  };
};
