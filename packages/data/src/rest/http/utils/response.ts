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
  const clonedResponse = response.clone();

  // Try JSON first if content-type indicates JSON (case-insensitive)
  if (contentType.includes("application/json")) {
    try {
      return await clonedResponse.json();
    } catch (error: unknown) {
      // If JSON parsing fails, throw with context
      const parseError = error instanceof Error ? error : new Error(String(error));
      throw new Error(
        `Failed to parse response as JSON despite content-type indicating JSON: ${parseError.message}`,
      );
    }
  }

  // Try text if content-type indicates text (case-insensitive)
  if (contentType.includes("text/")) {
    return (await clonedResponse.text()) as T;
  }

  // For other content types, try JSON first, fallback to text
  try {
    const clonedResponse2 = response.clone();
    return await clonedResponse2.json();
  } catch {
    const clonedResponse3 = response.clone();
    return (await clonedResponse3.text()) as T;
  }
};
