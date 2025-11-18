import { shallowRef } from "vue";
import { useFzFetch } from "../../http";
import type { UseDeleteAction } from "./types";
import type { MutationActionOptions } from "../shared/types";
import { executeMutation } from "../shared/error-handling";

/**
 * Create a delete action for deleting an existing entity
 *
 * @param basePath - Base API path for the resource
 * @param options - Mutation action options
 * @returns Action return with data, error, isLoading, execute
 */
export const createDeleteAction = <T>(
  basePath: string,
  options?: MutationActionOptions,
): ReturnType<UseDeleteAction<T>> => {
  const data = shallowRef<T | null>(null);
  const error = shallowRef<Error | null>(null);
  const isLoading = shallowRef(false);

  const execute = async (pk: string | number): Promise<void> => {
    await executeMutation<T>(
      async () => {
        const response = useFzFetch<T>(
          `${basePath}/${pk}`,
          {
            method: "DELETE",
          },
          options?.timeout !== null && options?.timeout !== undefined
            ? { timeout: options.timeout }
            : undefined,
        );

        await response.execute();
        return response;
      },
      data,
      error,
      isLoading,
    );
  };

  return { data, error, isLoading, execute };
};

