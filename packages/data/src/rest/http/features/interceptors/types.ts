/**
 * Request interceptor function
 *
 * Called before the request is sent. Can modify the request or abort it.
 *
 * @param url - Request URL
 * @param requestInit - Request configuration (method, headers, body, etc.)
 * @returns Modified RequestInit, or null to abort the request
 *
 * @example
 * const requestInterceptor = async (url, requestInit) => {
 *   // Add custom header
 *   return {
 *     ...requestInit,
 *     headers: {
 *       ...requestInit.headers,
 *       'X-Custom-Header': 'value'
 *     }
 *   }
 * }
 *
 * @example
 * const requestInterceptor = async (url, requestInit) => {
 *   // Abort request if condition is met
 *   if (shouldAbort(url)) {
 *     return null
 *   }
 *   return requestInit
 * }
 */
export type RequestInterceptor = (
  url: string,
  requestInit: RequestInit,
) => RequestInit | null | Promise<RequestInit | null>;

/**
 * Response interceptor function
 *
 * Called after the response is received. Can modify the response or handle errors.
 *
 * @param response - Fetch Response object
 * @param url - Original request URL
 * @param requestInit - Original request configuration
 * @returns Modified Response, or throws error to handle failure
 *
 * @example
 * const responseInterceptor = async (response, url, requestInit) => {
 *   // Transform response body
 *   const data = await response.json()
 *   return new Response(JSON.stringify({ ...data, transformed: true }), response)
 * }
 *
 * @example
 * const responseInterceptor = async (response, url, requestInit) => {
 *   // Handle 401 errors globally
 *   if (response.status === 401) {
 *     // Refresh token logic
 *     throw new Error('Unauthorized')
 *   }
 *   return response
 * }
 */
export type ResponseInterceptor = (
  response: Response,
  url: string,
  requestInit: RequestInit,
) => Response | Promise<Response>;
