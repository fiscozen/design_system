import type { BaseActionReturn, MutationActionOptions } from "../shared/types";

/**
 * Options for useDelete. Alias for MutationActionOptions for consistent naming.
 */
export type UseDeleteActionOptions = MutationActionOptions;

/**
 * Return type for useDelete action
 */
export interface UseDeleteActionReturn<T> extends BaseActionReturn<T> {
  /**
   * Execute the delete action
   *
   * @param pk - Primary key of the entity to delete
   * @returns Promise that resolves when the request completes
   */
  execute: (pk: string | number) => Promise<void>;
}

/**
 * Delete an existing entity (DELETE)
 */
export interface UseDeleteAction<T> {
  (options?: UseDeleteActionOptions): UseDeleteActionReturn<T>;
}
