import { toValue, type MaybeRefOrGetter } from "vue";

/**
 * Build URL with query parameters, merging existing ones from basePath
 *
 * @param basePath - Base URL path (may contain existing query params)
 * @param queryParams - Additional query parameters to append/override (supports MaybeRefOrGetter)
 * @returns Complete URL with merged query parameters
 */
export const getUrlWithQueryParams = (
  basePath: MaybeRefOrGetter<string>,
  queryParams?: MaybeRefOrGetter<Record<string, string | number | boolean>>,
): string => {
  const searchParams = new URLSearchParams();

  // Extract existing query parameters from basePath
  const [baseUrl, existingQuery] = toValue(basePath).split("?");
  if (existingQuery) {
    // Add existing parameters
    const existing = new URLSearchParams(existingQuery);
    existing.forEach((value, key) => {
      searchParams.append(key, value);
    });
  }

  // Add new queryParams if present (they take priority)
  if (queryParams) {
    const resolvedParams = toValue(queryParams);
    Object.entries(resolvedParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Remove existing parameter and add new one (priority)
        searchParams.delete(key);
        searchParams.append(key, String(value));
      }
    });
  }

  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

