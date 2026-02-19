import { toValue, type MaybeRefOrGetter } from "vue";

/**
 * Sorts query parameters alphabetically by key
 *
 * @param searchParams - URLSearchParams instance
 * @returns Sorted array of [key, value] tuples
 */
const sortQueryParams = (
  searchParams: URLSearchParams,
): [string, string][] => {
  return Array.from(searchParams.entries()).sort(([a], [b]) =>
    a.localeCompare(b),
  );
};

/**
 * Removes trailing slash from a pathname.
 * Used when building action URLs to avoid double slashes when basePath ends with /.
 *
 * @param pathname - Pathname string
 * @returns Pathname without trailing slash
 */
export const removeTrailingSlash = (pathname: string): string => {
  return pathname.replace(/\/$/, "");
};

/**
 * Joins two path segments with a single slash. Strips trailing slash from the left
 * and leading slash from the right so that concatenation never produces "//".
 *
 * @param left - First segment (e.g. basePath)
 * @param right - Second segment (e.g. pk or path segment)
 * @returns left + '/' + right with no double slash at the boundary
 *
 * @example
 * joinPathSegments('api/v1/users/', 'self')   // 'api/v1/users/self'
 * joinPathSegments('api/v1/users', 'self')    // 'api/v1/users/self'
 * joinPathSegments('api/v1/users/', '/self')  // 'api/v1/users/self'
 */
export const joinPathSegments = (left: string, right: string): string => {
  const a = left.replace(/\/$/, "");
  const b = right.replace(/^\//, "");
  return b ? `${a}/${b}` : a;
};

/**
 * Splits a URL into the path (before first ? or #) and the rest (from first ? or # to end).
 * Shared by applyTrailingSlash and normalizeUrlForDeduplication to avoid duplicated parsing.
 *
 * @param url - Full URL or path string
 * @returns path = segment before first ? or #; rest = from that character to end (e.g. "?foo=bar" or "#section" or "")
 */
function splitUrlPathAndRest(url: string): { path: string; rest: string } {
  const queryIndex = url.indexOf("?");
  const hashIndex = url.indexOf("#");
  const pathEnd =
    queryIndex >= 0
      ? hashIndex >= 0
        ? Math.min(queryIndex, hashIndex)
        : queryIndex
      : hashIndex >= 0
        ? hashIndex
        : url.length;
  return {
    path: url.substring(0, pathEnd),
    rest: url.substring(pathEnd),
  };
}

/**
 * Trailing slash behavior for URL path normalization.
 * In useFzFetch options, null explicitly disables normalization for that request; undefined uses setup.
 */
export type TrailingSlashOption = true | false | null | undefined;

/**
 * Applies trailing slash to the path part of a URL based on the option.
 * Query string and fragment are preserved. Only the path (before ? or #) is modified.
 *
 * @param url - Full URL or path (relative or absolute)
 * @param option - true = ensure path ends with /; false = ensure path has no trailing /; null or undefined = return url unchanged
 * @returns URL with path normalized; query and fragment unchanged
 *
 * @example
 * applyTrailingSlash('users/1', true) // 'users/1/'
 * applyTrailingSlash('users/1/?foo=bar', false) // 'users/1?foo=bar'
 * applyTrailingSlash('users/1', null) // 'users/1'
 */
export const applyTrailingSlash = (
  url: string,
  option: TrailingSlashOption,
): string => {
  if (option !== true && option !== false) {
    return url;
  }

  const { path, rest } = splitUrlPathAndRest(url);
  const normalizedPath =
    option === true
      ? path.endsWith("/")
        ? path
        : path
          ? `${path}/`
          : "/"
      : path.replace(/\/$/, "");

  return `${normalizedPath}${rest}`;
};

/**
 * Normalizes URL by removing trailing slashes and sorting query parameters
 *
 * This is a shared utility for URL normalization used in deduplication and other contexts.
 * Handles absolute URLs, relative URLs with baseUrl, and relative URLs without baseUrl.
 *
 * @param url - Request URL to normalize
 * @param baseUrl - Optional base URL for resolving relative URLs
 * @returns Normalized URL string (pathname + sorted query params, no trailing slash)
 *
 * @example
 * normalizeUrlForDeduplication('/users/?page=2&limit=10') // '/users?limit=10&page=2'
 * normalizeUrlForDeduplication('https://api.com/users/?page=2&limit=10') // '/users?limit=10&page=2'
 */
export const normalizeUrlForDeduplication = (
  url: string,
  baseUrl?: string | null,
): string => {
  try {
    // Handle absolute URLs
    if (url.startsWith("http://") || url.startsWith("https://")) {
      const urlObj = new URL(url);
      const sortedParams = sortQueryParams(urlObj.searchParams);
      urlObj.search = "";
      sortedParams.forEach(([key, value]) => {
        urlObj.searchParams.append(key, value);
      });
      const pathname = removeTrailingSlash(urlObj.pathname);
      return `${pathname}${urlObj.search}`;
    }

    // Handle relative URLs with baseUrl
    if (baseUrl) {
      const urlObj = new URL(url, baseUrl);
      const sortedParams = sortQueryParams(urlObj.searchParams);
      urlObj.search = "";
      sortedParams.forEach(([key, value]) => {
        urlObj.searchParams.append(key, value);
      });
      const pathname = removeTrailingSlash(urlObj.pathname);
      return `${pathname}${urlObj.search}`;
    }

    // Handle relative URLs without baseUrl
    const { path, rest } = splitUrlPathAndRest(url);
    if (rest.startsWith("?")) {
      const params = new URLSearchParams(rest.slice(1));
      const sortedParams = sortQueryParams(params);
      const sortedQuery = new URLSearchParams(sortedParams).toString();
      return `${removeTrailingSlash(path)}${sortedQuery ? `?${sortedQuery}` : ""}`;
    }
    return removeTrailingSlash(path) + rest;
  } catch {
    // If URL parsing fails, return as-is
    return url;
  }
};

/**
 * Build URL with query parameters, merging existing ones from basePath
 *
 * @param basePath - Base URL path (may contain existing query params)
 * @param queryParams - Additional query parameters to append/override (supports MaybeRefOrGetter)
 * @returns Complete URL with merged query parameters
 */
export const getUrlWithQueryParams = (
  basePath: MaybeRefOrGetter<string>,
  queryParams?: MaybeRefOrGetter<Record<string, string | number | boolean | null>>,
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

  // Add new queryParams if present (they take priority). undefined = omit; null = send as "null"
  if (queryParams) {
    const resolvedParams = toValue(queryParams);
    if (resolvedParams != null && typeof resolvedParams === "object") {
      Object.entries(resolvedParams).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.delete(key);
          searchParams.append(key, String(value));
        }
      });
    }
  }

  const queryString = searchParams.toString();
  const urlWithQuery = queryString ? `${baseUrl}?${queryString}` : baseUrl;
  // Preserve fragment if it existed in the original URL
  return fragment ? `${urlWithQuery}${fragment}` : urlWithQuery;
};
