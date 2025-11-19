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

