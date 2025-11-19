import type { ShallowRef } from "vue";
import type { BaseActionReturn } from "../shared/types";
import type { MutationActionOptions } from "../shared/types";

/**
 * Return type for useCreate action
 */
export interface UseCreateActionReturn<T> extends BaseActionReturn<T> {
  /**
   * Execute the create action
   *
   * @param payload - Data to create
   * @returns Promise that resolves when the request completes
   */
  execute: (payload: Partial<T>) => Promise<void>;
}

/**
 * Create a new entity (POST)
 */
export interface UseCreateAction<T> {
  (options?: MutationActionOptions): UseCreateActionReturn<T>;
}
