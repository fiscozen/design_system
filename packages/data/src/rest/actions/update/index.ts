import { shallowRef } from "vue";
import { useFzFetch } from "../../http";
import { joinPathSegments } from "../../http/utils/url";
import { CONTENT_TYPE_JSON } from "../../http/common";
import type { UseUpdateAction, UseUpdateExecuteOptions } from "./types";
import type { MutationActionOptions } from "../shared/types";
import { executeMutation } from "../shared/error-handling";
import { mutationOptionsToFetchOptions } from "../shared/normalize";
import { validatePrimaryKey } from "../shared/validation";

/**
 * Create an update action for updating an existing entity
 *
 * Supports partial updates (PATCH) and full replacement (PUT) via execute options.
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
    executeOptions?: UseUpdateExecuteOptions,
  ): Promise<void> => {
    const partialUpdate = executeOptions?.partialUpdate ?? true;
    const method = partialUpdate ? "PATCH" : "PUT";

    await executeMutation<T>(
      async () => {
        validatePrimaryKey(pk, "createUpdateAction");

        let body: string;
        try {
          body = JSON.stringify(payload);
        } catch (err: unknown) {
          const serializationError = err instanceof Error ? err : new Error(String(err));
          throw new Error(
            `[createUpdateAction] Failed to serialize payload: ${serializationError.message}`,
          );
        }

        const response = useFzFetch<T>(joinPathSegments(basePath, String(pk)), {
          method,
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
