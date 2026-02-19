import { reactive, toValue, watch } from "vue";
import { useFzFetch } from "../../http";
import { removeTrailingSlash } from "../../http/utils/url";
import type { UseFzFetchReturn } from "../../http/types";
import type { QueryActionReturn } from "./types";
import type {
  PaginationParams,
  FilterParams,
  SortParams,
  UseListActionParams,
} from "../list/types";
import type { UseActionOptions } from "./types";
import {
  normalizeOptions,
  normalizeParams,
  extractOptionValue,
  extractOptionsObject,
  isParamsObject,
} from "./normalize";
import { getGlobalAutoUpdateDebounceDelay } from "../../http/setup/state";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../../http/config";
import { validatePaginationValue } from "./validation";

/**
 * Base function for creating list actions with configurable response type
 *
 * Extracts common logic (params extraction, reactive objects, watch, etc.)
 * and allows customizing:
 * - Response type (TResponse - e.g., T[] or PaginatedResponse<T>)
 * - Response normalization function
 *
 * @param basePath - Base API path for the resource
 * @param paramsOrOptions - Either UseListActionParams or UseActionOptions
 * @param options - Optional UseActionOptions (when params are provided)
 * @param normalizeResponseFn - Function to normalize the response
 * @returns Base list action return with filters, ordering, pagination
 */
export const createListBase = <TResponse, TData>(
  basePath: string,
  paramsOrOptions: UseListActionParams | UseActionOptions | undefined,
  options: UseActionOptions | undefined,
  normalizeResponseFn: (
    response: UseFzFetchReturn<TResponse>,
    throwOnError: boolean,
  ) => QueryActionReturn<TData[]>,
) => {
  // Extract initial values and create reactive objects
  const getInitialValue = <T>(
    key: "filters" | "ordering" | "pagination",
    defaultValue: T,
  ): T => {
    if (isParamsObject(paramsOrOptions) && key in paramsOrOptions) {
      const value = toValue(paramsOrOptions[key]);
      return (value ?? defaultValue) as T;
    }
    return defaultValue;
  };

  const initialFilters = getInitialValue("filters", {} as FilterParams);
  const initialOrdering = getInitialValue("ordering", [] as SortParams);
  const hasPagination = isParamsObject(paramsOrOptions) && "pagination" in paramsOrOptions;
  const initialPagination: PaginationParams = hasPagination
    ? (toValue(paramsOrOptions.pagination) as PaginationParams) || ({} as PaginationParams)
    : ({} as PaginationParams);

  // Create reactive objects for direct modification
  const filters = reactive<FilterParams>({ ...initialFilters });
  const ordering = reactive<SortParams>([...initialOrdering]);
  
  // Apply defaults if pagination is provided (even if empty)
  // Validate pagination values before applying
  if (hasPagination) {
    validatePaginationValue(initialPagination.page, "page", "createListBase");
    validatePaginationValue(initialPagination.pageSize, "pageSize", "createListBase", 1000);
  }
  
  const pagination = reactive<PaginationParams>(
    hasPagination
      ? {
          page:
            initialPagination.page !== undefined
              ? initialPagination.page
              : DEFAULT_PAGE,
          pageSize:
            initialPagination.pageSize !== undefined
              ? initialPagination.pageSize
              : DEFAULT_PAGE_SIZE,
        }
      : {},
  );

  // Extract throwOnError from options or paramsOrOptions
  const throwOnError = extractOptionValue(
    options,
    paramsOrOptions,
    "throwOnError",
    false,
  );

  // Create useFzFetch with reactive params
  const optionsToNormalize = extractOptionsObject(
    options,
    paramsOrOptions,
  ) as UseActionOptions;
  const normalizedOptions = normalizeOptions(optionsToNormalize);

  const response = useFzFetch<TResponse>(
    removeTrailingSlash(basePath),
    normalizeParams({ filters, ordering, pagination }),
    normalizedOptions,
  );

  // Watch reactive objects for changes and trigger refetch if autoUpdate is enabled
  const autoUpdate = toValue(normalizedOptions.refetch ?? true);
  if (autoUpdate) {
    // Use a flag to prevent race conditions when params change rapidly
    let isExecuting = false;
    let watchTimeout: ReturnType<typeof setTimeout> | null = null;
    let hasPendingChanges = false;
    const debounceDelay = getGlobalAutoUpdateDebounceDelay();

    const executeRequest = async () => {
      isExecuting = true;
      watchTimeout = null; // Reset timeout reference
      try {
        await response.execute(throwOnError);
      } finally {
        isExecuting = false;
        // If there were pending changes while we were executing, trigger a new request
        if (hasPendingChanges) {
          hasPendingChanges = false;
          // Schedule execution after a short delay to ensure the previous request is fully complete
          watchTimeout = setTimeout(executeRequest, debounceDelay);
        }
      }
    };

    watch(
      [filters, ordering, pagination],
      async () => {
        // Cancel previous timeout if exists (debounce: group rapid changes)
        if (watchTimeout !== null) {
          clearTimeout(watchTimeout);
          watchTimeout = null;
        }

        // If a request is already in progress, mark that we have pending changes
        // and schedule execution after the current request completes
        if (isExecuting || response.isFetching.value) {
          hasPendingChanges = true;
          return;
        }

        // Debounce: wait for debounceDelay before executing
        // If more changes arrive during this time, cancel and restart
        watchTimeout = setTimeout(executeRequest, debounceDelay);
      },
      { deep: true, immediate: false },
    );
    // Note: watch() is automatically cleaned up by Vue when the component using this
    // composable unmounts. The setTimeout is short-lived (debounce delay) and safe.
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
