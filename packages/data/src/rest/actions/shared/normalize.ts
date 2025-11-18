import { computed, toValue } from "vue";
import type { UseFzFetchOptions, UseFzFetchReturn, UseFzFetchParams } from "../../http/types";
import type { UseActionOptions, QueryActionReturn } from "./types";
import type { ListActionParams, ListActionReturn } from "../list/types";

/**
 * Normalize action options to UseFzFetchOptions
 *
 * @param options - Action options
 * @returns Normalized UseFzFetchOptions
 */
export const normalizeOptions = (
  options: UseActionOptions = {},
): UseFzFetchOptions => {
  const normalized: UseFzFetchOptions = {
    immediate: options.onMount ?? true,
    refetch: options.autoUpdate ?? true,
    initialData: options.initialData ?? null,
    deduplication: options.deduplication,
  };
  
  // Only include timeout if it's a number (not null)
  if (options.timeout !== null && options.timeout !== undefined) {
    normalized.timeout = options.timeout;
  }
  
  return normalized;
};

/**
 * Normalize list action params into query parameters
 *
 * Supports reactive params using MaybeRefOrGetter.
 * Returns a computed object that updates when reactive params change.
 *
 * @param params - List action params (filters, sort, page, pageSize)
 * @returns UseFzFetchParams with reactive queryParams
 */
export const normalizeParams = (params: ListActionParams = {}): UseFzFetchParams => {
  return {
    queryParams: computed(() => {
      const queryParams: Record<string, string | number | boolean> = {};

      // Filters: { by_city: 'san_diego' } → queryParams.by_city = 'san_diego'
      if (params.filters) {
        const filters = toValue(params.filters);

        // Validate filters is an object
        if (
          filters === null ||
          typeof filters !== "object" ||
          Array.isArray(filters)
        ) {
          throw new Error(
            "[normalizeParams] filters must be an object (Record<string, string | number | boolean | null | undefined>)",
          );
        }

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams[key] = value;
          }
        });
      }

      // Sort: { name: 'asc', created_at: 'desc' } → queryParams.sort = 'name:asc,created_at:desc'
      if (params.sort) {
        const sort = toValue(params.sort);
        const sortEntries = Object.entries(sort).map(
          ([key, direction]) => `${key}:${direction}`,
        );
        if (sortEntries.length > 0) {
          queryParams.sort = sortEntries.join(",");
        }
      }

      // Pagination
      if (params.page !== undefined) {
        queryParams.page = toValue(params.page);
      }
      if (params.pageSize !== undefined) {
        queryParams.per_page = toValue(params.pageSize);
      }

      return queryParams;
    }),
  };
};

/**
 * Normalize UseFzFetchReturn to QueryActionReturn
 *
 * @param response - UseFzFetchReturn from useFzFetch
 * @returns QueryActionReturn with computed properties
 */
export const normalizeResponse = <T>(
  response: UseFzFetchReturn<T>,
): QueryActionReturn<T> => {
  return {
    error: computed(() => response.error.value),
    data: computed(() => response.data.value),
    isLoading: computed(() => response.isFetching.value),
    execute: response.execute,
  } as QueryActionReturn<T>;
};

/**
 * Normalize UseFzFetchReturn to ListActionReturn (for list actions)
 *
 * @param response - UseFzFetchReturn from useFzFetch (expects array type)
 * @returns ListActionReturn with computed properties
 */
export const normalizeListResponse = <T>(
  response: UseFzFetchReturn<T[]>,
): ListActionReturn<T> => {
  return {
    error: computed(() => response.error.value),
    data: computed(() => response.data.value),
    isLoading: computed(() => response.isFetching.value),
    execute: response.execute,
  } as ListActionReturn<T>;
};
