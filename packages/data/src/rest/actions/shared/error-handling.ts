import type { ShallowRef } from "vue";
import type { UseFzFetchReturn } from "../../http/types";
import { isEmptyResponseStatus } from "../../http/features/empty-response/predicate";
import { normalizeError } from "../../http/utils/error";

/**
 * Executes a fetch response, suppressing parse errors for empty-body status codes (204, 205).
 *
 * VueUse throws a SyntaxError when .json() is called on an empty body.
 * The sync watcher in wrapWithEmptyResponseNormalizer clears data/error,
 * but the original error is still thrown by execute(). This guard catches it
 * and returns the (already cleaned) response for empty-body statuses.
 */
export async function executeWithEmptyResponseGuard<T>(
  response: UseFzFetchReturn<T>,
  throwOnError: boolean,
): Promise<UseFzFetchReturn<T>> {
  try {
    await response.execute(throwOnError);
  } catch (err) {
    if (isEmptyResponseStatus(response.statusCode.value)) {
      return response;
    }
    throw err;
  }
  return response;
}

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
      // Explicitly set data to null on error for consistency
      data.value = null;
      if (throwOnError) {
        throw response.error.value;
      }
      // If throwOnError is false, error is already stored in error.value
      return;
    }
  } catch (err: unknown) {
    const normalizedError = normalizeError(err);
    error.value = normalizedError;
    // Explicitly set data to null on error for consistency
    data.value = null;

    if (throwOnError) {
      throw normalizedError;
    }
    // If throwOnError is false, error is stored in error.value, don't throw
  } finally {
    isLoading.value = false;
  }
}
