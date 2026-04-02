import { computed, toValue, type MaybeRefOrGetter } from "vue";
import { useFzFetch } from "../../http";
import { joinPathSegments } from "../../http/utils/url";
import type { UseRetrieveAction } from "./types";
import type { QueryActionOptions } from "../shared/types";
import { normalizeOptions, normalizeResponse } from "../shared/normalize";
import { validatePrimaryKey } from "../shared/validation";

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

  validatePrimaryKey(toValue(pk), "createRetrieveAction");

  const url = computed(() => {
    const resolvedPk = toValue(pk);
    validatePrimaryKey(resolvedPk, "createRetrieveAction");
    return joinPathSegments(basePath, String(resolvedPk));
  });
  const response = useFzFetch<T>(url, normalizeOptions(options));
  return normalizeResponse<T>(response, options?.throwOnError ?? false);
};
