import { computed, toValue } from "vue";
import type { UseFzFetchOptions, UseFzFetchReturn, UseFzFetchParams } from "../../http/types";
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
 * Accepts reactive objects (filters, sort, pagination) and converts them to query string format.
 * Returns a computed object that updates when reactive params change.
 *
 * @param params - Reactive list action params (filters, sort, pagination)
 * @returns UseFzFetchParams with reactive queryParams
 */
export const normalizeParams = (params: {
  filters?: FilterParams;
  sort?: SortParams;
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

      // Sort: [{ name: 'asc' }, { created_at: 'desc' }] → queryParams.sort = 'name:asc,created_at:desc'
      if (params.sort && Array.isArray(params.sort) && params.sort.length > 0) {
        const sortEntries: string[] = [];
        
        params.sort.forEach((sortObj) => {
          Object.entries(sortObj).forEach(([key, direction]) => {
            sortEntries.push(`${key}:${direction}`);
          });
        });
        
        if (sortEntries.length > 0) {
          queryParams.sort = sortEntries.join(",");
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
 * (createListAction) adds filters, sort, and pagination reactive objects
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
