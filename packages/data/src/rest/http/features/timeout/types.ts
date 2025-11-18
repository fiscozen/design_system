/**
 * Timeout error class
 * 
 * Thrown when a request exceeds the configured timeout duration.
 */
export class TimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`Request timeout after ${timeoutMs}ms`);
    this.name = "TimeoutError";
  }
}

