import { computed, toValue } from "vue";
import type {
  UseFzFetchOptions,
  UseFzFetchReturn,
  UseFzFetchParams,
} from "../../http/types";
import type { UseActionOptions, QueryActionReturn } from "./types";
import type { PaginationParams, FilterParams, SortParams } from "../list/types";
import { DEFAULT_DATA_KEY } from "../../http/config";

/**
 * Check if paramsOrOptions is a params object (has filters, ordering, or pagination)
 * vs an options object
 */
export const isParamsObject = (
  paramsOrOptions: unknown,
): paramsOrOptions is { filters?: unknown; ordering?: unknown; pagination?: unknown } => {
  if (!paramsOrOptions || typeof paramsOrOptions !== "object") {
    return false;
  }
  return (
    "filters" in paramsOrOptions ||
    "ordering" in paramsOrOptions ||
    "pagination" in paramsOrOptions
  );
};

/**
 * Safely gets a property value from an object with type checking
 */
const getPropertyValue = <TValue>(
  obj: Record<string, unknown>,
  property: string,
  defaultValue: TValue,
): TValue => {
  const value = obj[property];
  return (value !== undefined ? (value as TValue) : defaultValue);
};

/**
 * Extract a property value from options or paramsOrOptions with a default fallback
 *
 * This helper simplifies the complex nested ternary pattern used throughout the codebase
 * to extract option values when dealing with function overloads.
 *
 * Priority:
 * 1. If `options` is provided, use `options[property] ?? defaultValue`
 * 2. If `paramsOrOptions` exists and is an options object (not params), use `paramsOrOptions[property] ?? defaultValue`
 * 3. Otherwise, use `defaultValue`
 *
 * @param options - Explicit options object (when params are provided)
 * @param paramsOrOptions - Either params or options object (function overload)
 * @param property - Property name to extract from options
 * @param defaultValue - Default value if property is not found
 * @returns Extracted property value or default
 */
export const extractOptionValue = <TOptions extends object, TValue>(
  options: TOptions | undefined,
  paramsOrOptions: TOptions | unknown | undefined,
  property: keyof TOptions,
  defaultValue: TValue,
): TValue => {
  // Priority 1: Explicit options parameter
  if (options !== undefined) {
    return getPropertyValue(
      options as Record<string, unknown>,
      property as string,
      defaultValue,
    );
  }

  // Priority 2: paramsOrOptions is an options object (not params)
  if (paramsOrOptions && !isParamsObject(paramsOrOptions)) {
    return getPropertyValue(
      paramsOrOptions as Record<string, unknown>,
      property as string,
      defaultValue,
    );
  }

  // Priority 3: Default value
  return defaultValue;
};

/**
 * Extract the entire options object from options or paramsOrOptions
 *
 * Similar to extractOptionValue but returns the entire options object instead of a single property.
 *
 * @param options - Explicit options object (when params are provided)
 * @param paramsOrOptions - Either params or options object (function overload)
 * @returns Options object or empty object
 */
export const extractOptionsObject = <TOptions extends object>(
  options: TOptions | undefined,
  paramsOrOptions: TOptions | unknown | undefined,
): TOptions => {
  // Priority 1: Explicit options parameter
  if (options !== undefined) {
    return options;
  }

  // Priority 2: paramsOrOptions is an options object (not params)
  if (paramsOrOptions && !isParamsObject(paramsOrOptions)) {
    return paramsOrOptions as TOptions;
  }

  // Priority 3: Empty object
  return {} as TOptions;
};

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
      const queryParams: Record<string, string | number | boolean | null> = {};

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

        // undefined = omit from request (e.g. remove default filter); null = send to server
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value !== undefined) {
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
          queryParams.page_size = params.pagination.pageSize;
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
  dataKey: string = DEFAULT_DATA_KEY,
  throwOnError: boolean = false,
): QueryActionReturn<T[]> => {
  const originalExecute = response.execute;

  // Extract data array from paginated response
  const data = computed(() => {
    const paginatedData = response.data.value;
    if (!paginatedData) return null;

    // Extract array from response using dataKey with type-safe access
    const paginatedDataRecord = paginatedData as Record<string, unknown>;
    const dataArray = paginatedDataRecord[dataKey];

    // Validate dataKey exists in response
    if (dataArray === undefined) {
      const availableKeys = Object.keys(paginatedDataRecord).join(", ");
      throw new Error(
        `[normalizePaginatedListResponse] Key "${dataKey}" not found in response. Available keys: ${availableKeys}`,
      );
    }

    // Validate it's an array
    if (!Array.isArray(dataArray)) {
      throw new Error(
        `[normalizePaginatedListResponse] Expected array at key "${dataKey}", got ${typeof dataArray}`,
      );
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
