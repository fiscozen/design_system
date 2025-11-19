import type { CsrfOptions } from "./types";
import { MUTATION_METHODS, DEFAULT_HTTP_METHOD } from "../../common";

/**
 * Manages automatic CSRF token injection for requests
 *
 * Workflow:
 * 1. Backend sets CSRF cookie on first request
 * 2. CsrfManager reads the cookie automatically
 * 3. Every POST/PUT/PATCH/DELETE request includes CSRF header
 * 4. Backend validates the token
 *
 * @example
 * const manager = new CsrfManager({
 *   enabled: true,
 *   cookieName: 'csrf_token',
 *   headerName: 'X-CSRF-Token'
 * }, true)
 *
 * // Inject token automatically
 * const headers = manager.injectToken({ 'Content-Type': 'application/json' })
 *
 * @internal
 */
export class CsrfManager {
  constructor(
    private options: CsrfOptions,
    private debug: boolean = false,
  ) {}

  /**
   * Reads CSRF token from cookie
   *
   * @returns CSRF token string or null if not found
   */
  private getTokenFromCookie(): string | null {
    if (typeof document === "undefined") {
      if (this.debug) {
        console.debug("[CsrfManager] document is undefined, cannot read cookie");
      }
      return null;
    }

    const cookies = document.cookie.split(";");
    const cookieName = this.options.cookieName.trim();

    for (const cookie of cookies) {
      // Find first '=' to handle values containing '='
      // Use indexOf to find the first occurrence, then substring to extract name and value
      const equalIndex = cookie.indexOf("=");
      if (equalIndex === -1) continue;
      
      const name = cookie.substring(0, equalIndex).trim();
      // Extract everything after the first '=' as the value
      const value = cookie.substring(equalIndex + 1).trim();
      
      if (name === cookieName) {
        if (this.debug) {
          console.debug(`[CsrfManager] Found CSRF token in cookie: ${cookieName}`);
        }
        return decodeURIComponent(value);
      }
    }

    if (this.debug) {
      console.debug(`[CsrfManager] CSRF token not found in cookie: ${cookieName}`);
    }
    return null;
  }

  /**
   * Injects CSRF token into request headers
   *
   * Only injects for mutation methods (POST, PUT, PATCH, DELETE).
   * Returns headers unchanged if token is not found or method doesn't require CSRF.
   *
   * @param headers - Existing request headers
   * @param method - HTTP method
   * @returns Headers with CSRF token added (if applicable)
   */
  injectToken(
    headers: Record<string, string> = {},
    method: string = DEFAULT_HTTP_METHOD,
  ): Record<string, string> {
    // Only inject for mutation methods
    if (!MUTATION_METHODS.includes(method.toUpperCase() as typeof MUTATION_METHODS[number])) {
      if (this.debug) {
        console.debug(
          `[CsrfManager] Skipping CSRF injection for method: ${method}`,
        );
      }
      return headers;
    }

    // Get token from cookie
    const token = this.getTokenFromCookie();
    if (!token) {
      if (this.debug) {
        console.warn(
          `[CsrfManager] CSRF token not found in cookie: ${this.options.cookieName}`,
        );
      }
      return headers;
    }

    // Inject token into headers
    const headersWithToken = {
      ...headers,
      [this.options.headerName]: token,
    };

    if (this.debug) {
      console.debug(
        `[CsrfManager] Injected CSRF token into header: ${this.options.headerName}`,
      );
    }

    return headersWithToken;
  }
}

