import type { BaseActionReturn, MutationActionOptions } from "../shared/types";

/**
 * Options for useUpdate. Alias for MutationActionOptions for consistent naming.
 */
export type UseUpdateActionOptions = MutationActionOptions;

/**
 * Options for update execute (partial vs full replacement)
 */
export interface UseUpdateExecuteOptions {
  /**
   * Whether to perform a partial update (PATCH) or full replacement (PUT)
   *
   * @default true
   */
  partialUpdate?: boolean;
}

/**
 * Return type for useUpdate action
 */
export interface UseUpdateActionReturn<T> extends BaseActionReturn<T> {
  /**
   * Execute the update action
   *
   * @param pk - Primary key of the entity to update
   * @param payload - Data to update
   * @param options - Execute options (partialUpdate defaults to true)
   * @returns Promise that resolves when the request completes
   */
  execute: (
    pk: string | number,
    payload: Partial<T>,
    options?: UseUpdateExecuteOptions,
  ) => Promise<void>;
}

/**
 * Update an existing entity (PUT/PATCH)
 */
export interface UseUpdateAction<T> {
  (options?: UseUpdateActionOptions): UseUpdateActionReturn<T>;
}
