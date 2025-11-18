import { computed, toValue, type MaybeRefOrGetter } from "vue";
import { useFzFetch } from "../../http";
import type { UseRetrieveAction } from "./types";
import type { QueryActionOptions } from "../shared/types";
import { normalizeOptions, normalizeResponse } from "../shared/normalize";

/**
 * Create a retrieve action for fetching a single entity by primary key
 *
 * @param basePath - Base API path for the resource
 * @param pk - Primary key (can be reactive)
 * @param options - Action options
 * @returns QueryActionReturn with data, error, isLoading, execute
 */
export const createRetrieveAction = <T>(
  basePath: string,
  pk: MaybeRefOrGetter<string | number> | undefined,
  options?: QueryActionOptions<T>,
): ReturnType<UseRetrieveAction<T>> => {
  if (pk === undefined) {
    throw new Error(
      "[createRetrieveAction] Primary key (pk) is required for retrieve action",
    );
  }

  // Create reactive URL with validation
  const url = computed(() => {
    const resolvedPk = toValue(pk);

    // Validate pk is not empty when resolved (handles reactive values)
    if (
      resolvedPk === null ||
      resolvedPk === undefined ||
      (typeof resolvedPk === "string" && resolvedPk.trim() === "") ||
      (typeof resolvedPk === "number" && isNaN(resolvedPk))
    ) {
      throw new Error(
        "[createRetrieveAction] Primary key (pk) must be a valid non-empty string or number",
      );
    }

    return `${basePath}/${resolvedPk}`;
  });
  const response = useFzFetch<T>(url, normalizeOptions(options));
  return normalizeResponse<T>(response);
};

