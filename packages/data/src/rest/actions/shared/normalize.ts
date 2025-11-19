import { computed, toValue } from "vue";
import type {
  UseFzFetchOptions,
  UseFzFetchReturn,
  UseFzFetchParams,
} from "../../http/types";
import type { UseActionOptions, QueryActionReturn } from "./types";
import type { PaginationParams, FilterParams, SortParams } from "../list/types";

/**
 * Normalize action options to UseFzFetchOptions
 *
 * @param options - Action options
 * @returns Normalized UseFzFetchOptions
 */
export const normalizeOptions = (
  options: UseActionOptions = {},
): UseFzFetchOptions => {
  return {
    immediate: options.onMount ?? true,
    refetch: options.autoUpdate ?? true,
    initialData: options.initialData ?? null,
    deduplication: options.deduplication,
  };
};

/**
 * Normalize list action reactive params into query parameters
 *
 * Accepts reactive objects (filters, ordering, pagination) and converts them to query string format.
 * Returns a computed object that updates when reactive params change.
 *
 * @param params - Reactive list action params (filters, ordering, pagination)
 * @returns UseFzFetchParams with reactive queryParams
 */
export const normalizeParams = (params: {
  filters?: FilterParams;
  ordering?: SortParams;
  pagination?: PaginationParams;
}): UseFzFetchParams => {
  return {
    queryParams: computed(() => {
      const queryParams: Record<string, string | number | boolean> = {};

      // Filters: { by_city: 'san_diego' } → queryParams.by_city = 'san_diego'
      if (params.filters) {
        // Validate filters is an object
        if (
          params.filters === null ||
          typeof params.filters !== "object" ||
          Array.isArray(params.filters)
        ) {
          throw new Error(
            "[normalizeParams] filters must be an object (Record<string, string | number | boolean | null | undefined>)",
          );
        }

        // Validate that all keys are strings
        for (const key in params.filters) {
          if (typeof key !== "string") {
            throw new Error(
              `[normalizeParams] Filter keys must be strings, got ${typeof key}`,
            );
          }
        }

        Object.entries(params.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams[key] = value;
          }
        });
      }

      // Ordering: [{ name: 'asc' }, { created_at: 'desc' }, { status: 'none' }] → queryParams.ordering = 'name,-created_at'
      // Values with direction 'none' are excluded from the query string
      // Desc fields are prefixed with '-' (e.g., '-created_at'), asc fields have no prefix (e.g., 'name')
      if (
        params.ordering &&
        Array.isArray(params.ordering) &&
        params.ordering.length > 0
      ) {
        const orderingEntries: string[] = [];

        params.ordering.forEach((sortObj) => {
          Object.entries(sortObj).forEach(([key, direction]) => {
            // Exclude 'none' values from query string
            if (direction !== "none") {
              // Prepend '-' for desc, no prefix for asc
              const field = direction === "desc" ? `-${key}` : key;
              orderingEntries.push(field);
            }
          });
        });

        if (orderingEntries.length > 0) {
          queryParams.ordering = orderingEntries.join(",");
        }
      }

      // Pagination
      if (params.pagination) {
        if (params.pagination.page !== undefined) {
          queryParams.page = params.pagination.page;
        }
        if (params.pagination.pageSize !== undefined) {
          queryParams.per_page = params.pagination.pageSize;
        }
      }

      return queryParams;
    }),
  };
};

/**
 * Normalize UseFzFetchReturn to QueryActionReturn
 *
 * @param response - UseFzFetchReturn from useFzFetch
 * @param throwOnError - Whether to throw errors instead of storing in error ref
 * @returns QueryActionReturn with computed properties
 */
export const normalizeResponse = <T>(
  response: UseFzFetchReturn<T>,
  throwOnError: boolean = false,
): QueryActionReturn<T> => {
  const originalExecute = response.execute;

  return {
    error: computed(() => response.error.value),
    data: computed(() => response.data.value),
    isLoading: computed(() => response.isFetching.value),
    execute: async () => {
      await originalExecute(throwOnError);
    },
  } as QueryActionReturn<T>;
};

/**
 * Normalize UseFzFetchReturn to QueryActionReturn (for list actions)
 *
 * Note: This returns only the base QueryActionReturn. The calling code
 * (createListAction) adds filters, ordering, and pagination reactive objects
 * to create the full ListActionReturn.
 *
 * @param response - UseFzFetchReturn from useFzFetch (expects array type)
 * @param throwOnError - Whether to throw errors instead of storing in error ref
 * @returns QueryActionReturn with computed properties
 */
export const normalizeListResponse = <T>(
  response: UseFzFetchReturn<T[]>,
  throwOnError: boolean = false,
): QueryActionReturn<T[]> => {
  const originalExecute = response.execute;

  return {
    error: computed(() => response.error.value),
    data: computed(() => response.data.value),
    isLoading: computed(() => response.isFetching.value),
    execute: async () => {
      await originalExecute(throwOnError);
    },
  } as QueryActionReturn<T[]>;
};

/**
 * Normalize paginated response to extract data array
 *
 * Extracts the data array from the paginated response using the specified dataKey,
 * and returns normalized QueryActionReturn with the extracted array as data.
 *
 * @param response - UseFzFetchReturn from useFzFetch (expects PaginatedResponse type)
 * @param dataKey - Key name in response that contains the data array (default: 'results')
 * @param throwOnError - Whether to throw errors instead of storing in error ref
 * @returns QueryActionReturn with computed data array
 */
export const normalizePaginatedListResponse = <T>(
  response: UseFzFetchReturn<{
    results: T[];
    count: number;
    next: string | null;
    previous: string | null;
    pages: number;
    page: number;
    [key: string]: unknown;
  }>,
  dataKey: string = "results",
  throwOnError: boolean = false,
): QueryActionReturn<T[]> => {
  const originalExecute = response.execute;

  // Extract data array from paginated response
  const data = computed(() => {
    const paginatedData = response.data.value;
    if (!paginatedData) return null;

    // Extract array from response using dataKey
    const dataArray = (paginatedData as any)[dataKey];

    // Validate it's an array
    if (!Array.isArray(dataArray)) {
      console.warn(
        `[normalizePaginatedListResponse] Expected array at key "${dataKey}", got ${typeof dataArray}`,
      );
      return null;
    }

    return dataArray as T[];
  });

  return {
    error: computed(() => response.error.value),
    data,
    isLoading: computed(() => response.isFetching.value),
    execute: async () => {
      await originalExecute(throwOnError);
    },
  } as QueryActionReturn<T[]>;
};
