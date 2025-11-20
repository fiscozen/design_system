/**
 * CSRF configuration options
 */
export interface CsrfOptions {
  /**
   * Enable CSRF token injection
   * @default false
   */
  enabled: boolean;

  /**
   * Name of the cookie containing the CSRF token
   * @default 'csrf_token'
   */
  cookieName: string;

  /**
   * Name of the header to send the CSRF token
   * @default 'X-CSRF-Token'
   */
  headerName: string;
}
