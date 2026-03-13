/**
 * Low-level URL and History API helpers for useQueryString.
 *
 * All functions are pure or side-effect-isolated, making them
 * independently testable without Vue or Router dependencies.
 *
 * @module @fiscozen/composables/useQueryString/utils
 */

import type { QueryStringValue } from './types';

/** History state key used to persist query data across Vue Router navigations */
const HISTORY_STATE_QUERY_KEY = '__queryString';

/** Parses the current URL search params into a plain object */
const getQueryFromUrl = (): Record<string, string> => {
    return Object.fromEntries(new URLSearchParams(window.location.search).entries());
};

/**
 * Checks for "empty" in the query string sense: absent, null, or blank.
 * Zero and false are intentionally kept as meaningful values.
 */
const isEmptyValue = (value: unknown): boolean => {
    return value === undefined || value === null || value === '';
};

/** Converts all non-empty values to strings, discarding empty ones */
const normalizeQueryValues = (query: Record<string, unknown>): Record<string, string> => {
    const normalized: Record<string, string> = {};

    Object.entries(query).forEach(([key, value]) => {
        if (!isEmptyValue(value)) {
            normalized[key] = String(value);
        }
    });

    return normalized;
};

/** Reconstructs the full URL path preserving pathname and hash */
const buildUrlWithQuery = (query: Record<string, string>): string => {
    const queryString = new URLSearchParams(query).toString();
    return `${window.location.pathname}${queryString ? '?' + queryString : ''}${window.location.hash}`;
};

/**
 * Writes a query object to the URL via the History API.
 * Normalizes values to strings before building the URL.
 */
const setQueryToUrl = (
    query: Record<string, unknown>,
    state: Record<string, unknown>,
    usePushState: boolean = false
): void => {
    const normalizedQuery = normalizeQueryValues(query);
    const newUrl = buildUrlWithQuery(normalizedQuery);

    if (usePushState) {
        window.history.pushState(state, '', newUrl);
    } else {
        window.history.replaceState(state, '', newUrl);
    }
};

/**
 * Strips empty keys in-place. Mutates for performance since this
 * runs on every get/set operation in hot paths.
 */
const removeEmptyValues = (query: Record<string, QueryStringValue>): void => {
    Object.keys(query).forEach((key) => {
        if (isEmptyValue(query[key])) {
            delete query[key];
        }
    });
};

/**
 * Merges query data into the current history state under a dedicated key.
 * This secondary storage is needed because Vue Router does not reflect
 * History API changes in `route.query`.
 */
const buildHistoryState = (query: Record<string, unknown>): Record<string, unknown> => {
    const currentState = window.history.state || {};
    return {
        ...currentState,
        [HISTORY_STATE_QUERY_KEY]: query,
    };
};

/**
 * Flattens a query object that may contain array values (Vue Router's LocationQuery)
 * into a plain Record<string, string>. For arrays, takes the first element — consistent
 * with URLSearchParams.entries() which also returns only the first value per key.
 * Null values are dropped (same semantics as removeEmptyValues).
 */
const flattenQuery = (query: Record<string, unknown>): Record<string, string> => {
    const flat: Record<string, string> = {};

    Object.entries(query).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            const first = value[0];
            if (first != null) {
                flat[key] = String(first);
            }
        } else if (!isEmptyValue(value)) {
            flat[key] = String(value);
        }
    });

    return flat;
};

export {
    HISTORY_STATE_QUERY_KEY,
    getQueryFromUrl,
    isEmptyValue,
    normalizeQueryValues,
    buildUrlWithQuery,
    setQueryToUrl,
    removeEmptyValues,
    buildHistoryState,
    flattenQuery,
};
