/**
 * Utility functions for the Fiscozen Typeahead component library.
 *
 * @module @fiscozen/typeahead/utils
 */

/**
 * Type for functions that can be debounced
 */
type FuncToDebounce = (...args: unknown[]) => void;

/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified timeout has elapsed since the last invocation.
 *
 * Useful for limiting the rate of function calls, especially for input handlers
 * that trigger expensive operations like API calls or filtering.
 *
 * @param func - The function to debounce
 * @param timeout - Delay in milliseconds before invoking the function
 * @returns A debounced version of the input function
 *
 * @example
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('Searching for:', query)
 * }, 300)
 *
 * debouncedSearch('test') // Will execute after 300ms of no further calls
 */
function debounce(func: FuncToDebounce, timeout: number = 300): FuncToDebounce {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return function debounced(this: unknown, ...args: unknown[]) {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

export { debounce };
