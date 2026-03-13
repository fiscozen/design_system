/**
 * Utility functions for the Fiscozen Pagination component library.
 *
 * @module @fiscozen/pagination/utils
 */

/**
 * Reads the current page from the URL query string synchronously.
 *
 * Call in `setup()` to initialize the page ref with the value already present
 * in the URL, so the first API request uses the correct page. Without this,
 * the ref would start at the default and FzPagination would emit a corrected
 * value on mount — causing a redundant request.
 *
 * Works on every page mount (not just the initial app load): when the user
 * navigates between routes, `window.location.search` already reflects the
 * new URL at `setup()` time.
 *
 * @param defaultValue - Value returned when the key is absent or not a valid number
 * @param urlKey - Query parameter name to read
 * @returns The page number from the URL, or `defaultValue`
 *
 * @example
 * ```ts
 * import { getInitialPageFromUrl } from '@fiscozen/pagination'
 *
 * const currentPage = ref(getInitialPageFromUrl())
 * ```
 */
export function getInitialPageFromUrl(defaultValue: number = 1, urlKey: string = 'page'): number {
    const raw = new URLSearchParams(window.location.search).get(urlKey)

    if (raw === null || raw === '') {
        return defaultValue
    }

    const parsed = Number(raw)
    return Number.isNaN(parsed) ? defaultValue : parsed
}
