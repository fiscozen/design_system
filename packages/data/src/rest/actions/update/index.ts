import { shallowRef } from "vue";
import { useFzFetch } from "../../http";
import { CONTENT_TYPE_JSON } from "../../http/common";
import type { UseUpdateAction, UpdateOptions } from "./types";
import type { MutationActionOptions } from "../shared/types";
import { executeMutation } from "../shared/error-handling";

/**
 * Create an update action for updating an existing entity
 *
 * Supports partial updates (PATCH) and full replacement (PUT) based on updateOptions.
 *
 * @param basePath - Base API path for the resource
 * @param options - Mutation action options
 * @returns Action return with data, error, isLoading, execute
 */
export const createUpdateAction = <T>(
  basePath: string,
  options?: MutationActionOptions,
): ReturnType<UseUpdateAction<T>> => {
  const data = shallowRef<T | null>(null);
  const error = shallowRef<Error | null>(null);
  const isLoading = shallowRef(false);

  const execute = async (
    pk: string | number,
    payload: Partial<T>,
    updateOptions?: UpdateOptions,
  ): Promise<void> => {
    // Determine HTTP method based on partialUpdate option
    const partialUpdate = updateOptions?.partialUpdate ?? true;
    const method = partialUpdate ? "PATCH" : "PUT";

    await executeMutation<T>(
      async () => {
        const response = useFzFetch<T>(
          `${basePath}/${pk}`,
          {
            method,
            body: JSON.stringify(payload),
            headers: { "Content-Type": CONTENT_TYPE_JSON },
          },
          options?.timeout !== null && options?.timeout !== undefined
            ? { timeout: options.timeout }
            : undefined,
        );

        await response.execute(options?.throwOnError ?? false);
        return response;
      },
      data,
      error,
      isLoading,
      options?.throwOnError ?? false,
    );
  };

  return { data, error, isLoading, execute };
};

