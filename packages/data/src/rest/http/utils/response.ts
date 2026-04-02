/**
 * Parses response body based on content type
 *
 * Attempts to parse the response body as JSON or text based on the Content-Type header.
 * For unknown content types, tries JSON first, then falls back to text.
 *
 * @param response - Response object to parse
 * @returns Parsed body data
 * @throws Error if parsing fails
 *
 * @example
 * const data = await parseResponseBody<User>(response);
 */
export const parseResponseBody = async <T>(response: Response): Promise<T> => {
  const contentType = (response.headers.get("content-type") || "").toLowerCase();
  const text = await response.clone().text();

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text) as T;
    } catch (error: unknown) {
      const parseError = error instanceof Error ? error : new Error(String(error));
      throw new Error(
        `Failed to parse response as JSON despite content-type indicating JSON: ${parseError.message}`,
      );
    }
  }

  if (contentType.includes("text/")) {
    return text as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as T;
  }
};
