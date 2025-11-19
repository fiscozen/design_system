import type { UseListAction, ListActionParams } from "./types";
import type { UseActionOptions } from "../shared/types";
import { normalizeListResponse } from "../shared/normalize";
import { createListBase } from "../shared/create-list-base";

/**
 * Create a list action for fetching multiple entities with filters, ordering, and pagination
 *
 * Supports multiple overloads:
 * - useList() - No params, no options
 * - useList(options) - Options only
 * - useList(params) - Params only
 * - useList(params, options) - Both params and options
 *
 * Returns reactive objects (filters, ordering, pagination) that can be modified directly.
 * When autoUpdate is true, changes to these reactive objects trigger automatic refetch.
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
 * @param paramsOrOptions - Either ListActionParams or UseActionOptions
 * @param options - Optional UseActionOptions (when params are provided)
 * @returns ListActionReturn with data, error, isLoading, execute, filters, ordering, pagination
 */
export const createListAction = <T>(
  basePath: string,
  paramsOrOptions?: ListActionParams | UseActionOptions,
  options?: UseActionOptions,
): ReturnType<UseListAction<T>> => {
  const result = createListBase<T[], T>(
    basePath,
    paramsOrOptions,
    options,
    (response, throwOnError) =>
      normalizeListResponse<T>(response, throwOnError),
  );

  // Remove _rawResponse from return (internal use only)
  const { _rawResponse, ...cleanResult } = result as any;

  return cleanResult as ReturnType<UseListAction<T>>;
};
