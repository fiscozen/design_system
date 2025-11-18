import type { ShallowRef } from "vue";
import type { BaseActionReturn } from "../shared/types";
import type { MutationActionOptions } from "../shared/types";

/**
 * Options for update operations
 */
export interface UpdateOptions {
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
   * @param options - Update options (partialUpdate defaults to true)
   * @returns Promise that resolves when the request completes
   */
  execute: (
    pk: string | number,
    payload: Partial<T>,
    options?: UpdateOptions,
  ) => Promise<void>;
}

/**
 * Update an existing entity (PUT/PATCH)
 */
export interface UseUpdateAction<T> {
  (options?: MutationActionOptions): UseUpdateActionReturn<T>;
}

