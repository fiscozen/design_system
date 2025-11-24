/**
 * Configuration constants for HTTP operations
 *
 * Centralized configuration values that can be adjusted if needed.
 * These constants affect behavior across the HTTP layer.
 *
 * @internal
 */

/**
 * Maximum number of characters to use from non-JSON body for deduplication key
 *
 * Used to create a unique identifier for non-JSON request bodies.
 * A prefix of 100 characters is sufficient to distinguish most different bodies
 * while keeping the key size manageable.
 *
 * @default 100
 */
export const NON_JSON_BODY_PREFIX_LENGTH = 100;

/**
 * Default pagination page number (1-indexed)
 *
 * Used when pagination is provided but page is not specified.
 *
 * @default 1
 */
export const DEFAULT_PAGE = 1;

/**
 * Default pagination page size
 *
 * Used when pagination is provided but pageSize is not specified.
 *
 * @default 50
 */
export const DEFAULT_PAGE_SIZE = 50;

/**
 * Default data key for paginated responses
 *
 * Used to extract the data array from paginated responses when dataKey is not specified.
 * Most APIs return paginated data under the "results" key.
 *
 * @default "results"
 */
export const DEFAULT_DATA_KEY = "results";
