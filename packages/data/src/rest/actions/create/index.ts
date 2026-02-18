import { shallowRef } from "vue";
import { useFzFetch } from "../../http";
import { CONTENT_TYPE_JSON } from "../../http/common";
import type { UseCreateAction } from "./types";
import type { MutationActionOptions } from "../shared/types";
import { executeMutation } from "../shared/error-handling";
import { mutationOptionsToFetchOptions } from "../shared/normalize";

/**
 * Create a create action for creating a new entity
 *
 * @param basePath - Base API path for the resource
 * @param options - Mutation action options
 * @returns Action return with data, error, isLoading, execute
 */
export const createCreateAction = <T>(
  basePath: string,
  options?: MutationActionOptions,
): ReturnType<UseCreateAction<T>> => {
  const data = shallowRef<T | null>(null);
  const error = shallowRef<Error | null>(null);
  const isLoading = shallowRef(false);

  const execute = async (payload: Partial<T>): Promise<void> => {
    await executeMutation<T>(
      async () => {
        let body: string;
        try {
          body = JSON.stringify(payload);
        } catch (err: unknown) {
          const serializationError = err instanceof Error ? err : new Error(String(err));
          throw new Error(
            `[createCreateAction] Failed to serialize payload: ${serializationError.message}`,
          );
        }

        const response = useFzFetch<T>(basePath, {
          method: "POST",
          body,
          headers: { "Content-Type": CONTENT_TYPE_JSON },
        }, mutationOptionsToFetchOptions(options));

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
