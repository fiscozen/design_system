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
  const contentType = response.headers.get("content-type") || "";
  const clonedResponse = response.clone();

  // Try JSON first if content-type indicates JSON
  if (contentType.includes("application/json")) {
    return await clonedResponse.json();
  }

  // Try text if content-type indicates text
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

