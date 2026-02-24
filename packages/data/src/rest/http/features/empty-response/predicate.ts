/**
 * HTTP status codes that indicate an empty response body (no content to parse).
 * Used to normalize data/error state so consumers get null instead of parse errors.
 */
const EMPTY_RESPONSE_STATUSES: ReadonlySet<number> = new Set([204, 205]);

/**
 * Returns true if the given HTTP status code represents an empty response
 * (e.g. 204 No Content, 205 Reset Content).
 */
export const isEmptyResponseStatus = (status: number | null): boolean =>
  status !== null && EMPTY_RESPONSE_STATUSES.has(status);
