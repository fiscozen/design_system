/**
 * Normalizes an unknown error to an Error instance
 *
 * Converts any error-like value (Error, string, object, etc.) to a standard Error instance.
 * This ensures consistent error handling throughout the codebase.
 *
 * @param error - Error value of unknown type
 * @returns Normalized Error instance
 *
 * @example
 * try {
 *   // some code that might throw
 * } catch (error: unknown) {
 *   const normalizedError = normalizeError(error);
 *   console.error(normalizedError.message);
 * }
 */
export const normalizeError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === "string") {
    return new Error(error);
  }

  if (error && typeof error === "object" && "message" in error) {
    return new Error(String(error.message));
  }

  return new Error(String(error));
};

/**
 * Sets error on fetch result and optionally throws it
 *
 * This helper standardizes the pattern of normalizing an error, setting it on the fetch result,
 * and conditionally throwing it based on throwOnFailed flag.
 *
 * @param errorRef - ShallowRef to set the error on
 * @param error - Error value of unknown type
 * @param throwOnFailed - Whether to throw the error after setting it
 * @param debugMessage - Optional debug message prefix to log (only if globalDebug is enabled)
 * @returns The normalized error (useful if you need to throw it manually)
 *
 * @example
 * try {
 *   // some code
 * } catch (error: unknown) {
 *   handleFetchError(fetchResult.error, error, throwOnFailed, 'Operation failed');
 * }
 */
export const handleFetchError = <T extends { value: Error | null }>(
  errorRef: T,
  error: unknown,
  throwOnFailed?: boolean,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- reserved for caller debug logging
  _debugMessage?: string,
): Error => {
  const normalizedError = normalizeError(error);
  
  // Note: debugMessage logging should be done by caller if they have access to state.globalDebug
  // This avoids circular dependency issues
  
  errorRef.value = normalizedError;
  
  if (throwOnFailed) {
    throw normalizedError;
  }
  
  return normalizedError;
};
