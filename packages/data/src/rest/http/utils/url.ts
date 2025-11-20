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
  // Handle URLs with fragments (#) and multiple '?' characters
  const basePathValue = toValue(basePath);

  // Separate fragment from the rest of the URL
  const hashIndex = basePathValue.indexOf("#");
  const urlWithoutFragment =
    hashIndex === -1 ? basePathValue : basePathValue.substring(0, hashIndex);
  const fragment = hashIndex === -1 ? null : basePathValue.substring(hashIndex);

  // Extract query string (without fragment)
  const queryIndex = urlWithoutFragment.indexOf("?");
  const baseUrl =
    queryIndex === -1
      ? urlWithoutFragment
      : urlWithoutFragment.substring(0, queryIndex);
  const existingQuery =
    queryIndex === -1 ? null : urlWithoutFragment.substring(queryIndex + 1);

  if (existingQuery) {
    // Add existing parameters (fragment already excluded)
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
  const urlWithQuery = queryString ? `${baseUrl}?${queryString}` : baseUrl;
  // Preserve fragment if it existed in the original URL
  return fragment ? `${urlWithQuery}${fragment}` : urlWithQuery;
};
