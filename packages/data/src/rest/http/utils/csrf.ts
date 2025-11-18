import { state } from "../setup/state";

/**
 * Inject CSRF token into headers if necessary
 *
 * Only injects token for mutation methods (POST/PUT/PATCH/DELETE).
 * Safe methods (GET/HEAD/OPTIONS) don't require CSRF protection.
 *
 * @param method - HTTP method
 * @param headers - Existing headers
 * @returns Headers with CSRF token injected (if necessary)
 */
export const injectCsrfToken = (
  method: string,
  headers: Record<string, string> = {},
): Record<string, string> => {
  // If CSRF manager is not initialized, return original headers
  if (!state.csrfManager) {
    return headers;
  }

  // Inject CSRF token (method check is done inside injectToken)
  if (state.globalDebug) {
    console.debug(`[useFzFetch] Injecting CSRF token for ${method} request`);
  }
  return state.csrfManager.injectToken(headers, method);
};

