import type { ShallowRef } from "vue";
import type { UseFzFetchReturn } from "../../http/types";

/**
 * Executes a mutation action with standardized error handling
 *
 * This helper function encapsulates the common pattern for mutation actions:
 * - Sets loading state
 * - Clears previous errors
 * - Executes the fetch request
 * - Updates data and error state
 * - Normalizes errors to Error type
 * - Manages loading state in finally block
 *
 * @param executeFn - Function that returns a UseFzFetchReturn promise
 * @param data - ShallowRef to update with response data
 * @param error - ShallowRef to update with errors
 * @param isLoading - ShallowRef to update with loading state
 * @param throwOnError - Whether to throw errors instead of storing in error ref
 * @returns Promise that resolves when the mutation completes
 */
export async function executeMutation<T>(
  executeFn: () => Promise<UseFzFetchReturn<T>>,
  data: ShallowRef<T | null>,
  error: ShallowRef<Error | null>,
  isLoading: ShallowRef<boolean>,
  throwOnError: boolean = false,
): Promise<void> {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await executeFn();

    // Update local state
    data.value = response.data.value;
    error.value = response.error.value;

    if (response.error.value) {
      if (throwOnError) {
        throw response.error.value;
      }
      // If throwOnError is false, error is already stored in error.value
      return;
    }
  } catch (err) {
    // Normalize error to Error type
    const normalizedError =
      err instanceof Error ? err : new Error(String(err));
    error.value = normalizedError;
    
    if (throwOnError) {
      throw normalizedError;
    }
    // If throwOnError is false, error is stored in error.value, don't throw
  } finally {
    isLoading.value = false;
  }
}

