/**
 * Common constants for HTTP operations
 *
 * Centralized configuration for HTTP methods, content types, and other
 * shared values used across the HTTP layer.
 *
 * @internal
 */

/**
 * HTTP methods that require CSRF protection (mutations)
 */
export const MUTATION_METHODS = ["POST", "PUT", "PATCH", "DELETE"] as const;

/**
 * Default HTTP method for requests
 */
export const DEFAULT_HTTP_METHOD = "GET" as const;

/**
 * Content-Type header value for JSON requests
 */
export const CONTENT_TYPE_JSON = "application/json" as const;
