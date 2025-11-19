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
  
  if (typeof error === 'string') {
    return new Error(error);
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return new Error(String(error.message));
  }
  
  return new Error(String(error));
};

