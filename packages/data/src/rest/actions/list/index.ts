import { useFzFetch } from "../../http";
import type { UseListAction, ListActionParams } from "./types";
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
 * @param basePath - Base API path for the resource
 * @param paramsOrOptions - Either ListActionParams or UseActionOptions
 * @param options - Optional UseActionOptions (when params are provided)
 * @returns QueryActionReturn with data, error, isLoading, execute
 */
export const createListAction = <T>(
  basePath: string,
  paramsOrOptions?: ListActionParams | UseActionOptions,
  options?: UseActionOptions,
): ReturnType<UseListAction<T>> => {
  // Case 3: useList(params, options)
  if (options !== undefined) {
    const params = paramsOrOptions as ListActionParams;
    const response = useFzFetch<T[]>(
      `${basePath}`,
      normalizeParams(params),
      normalizeOptions(options),
    );
    return normalizeListResponse<T>(response);
  }

  // Case 2: useList(paramsOrOptions)
  if (paramsOrOptions !== undefined) {
    // Distinguish between ListActionParams and UseActionOptions
    if (
      "filters" in paramsOrOptions ||
      "sort" in paramsOrOptions ||
      "page" in paramsOrOptions ||
      "pageSize" in paramsOrOptions
    ) {
      // It's ListActionParams
      const params = paramsOrOptions as ListActionParams;
      const response = useFzFetch<T[]>(
        `${basePath}`,
        normalizeParams(params),
      );
      return normalizeListResponse<T>(response);
    } else {
      // It's UseActionOptions
      const actionOptions = paramsOrOptions as UseActionOptions;
      const response = useFzFetch<T[]>(
        `${basePath}`,
        normalizeOptions(actionOptions),
      );
      return normalizeListResponse<T>(response);
    }
  }

  // Case 1: useList()
  const response = useFzFetch<T[]>(`${basePath}`);
  return normalizeListResponse<T>(response);
};

