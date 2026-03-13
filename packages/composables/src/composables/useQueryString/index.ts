import type { RouteLocationNormalizedLoaded } from 'vue-router';

import type {
    GetValuesFromQueryString,
    HandledQueryStringKeys,
    SetValuesInQueryString,
    SetValuesInQueryStringOptions,
    ValuesInQueryStrings,
} from './types';

import {
    HISTORY_STATE_QUERY_KEY,
    getQueryFromUrl,
    normalizeQueryValues,
    buildUrlWithQuery,
    setQueryToUrl,
    removeEmptyValues,
    buildHistoryState,
} from './utils';

import { extractValues, hasAnyHandledKey } from './transform';

export type * from './types';

/**
 * Manages URL query parameters with type-safe extraction and History API synchronization.
 *
 * Bridges the gap between Vue Router's `route.query` (read-only, not updated by
 * direct History API calls) and the need to read/write typed query params.
 * Values are persisted in both the URL and history state to survive
 * Vue Router navigation quirks.
 *
 * Pass `null` as `route` to use the composable without Vue Router — all reads
 * and writes go through the browser History API and `window.location` directly.
 * This makes the composable usable in non-Vue-Router contexts (e.g. standalone pages,
 * micro-frontends, or any vanilla JS/TS environment).
 *
 * @param handledQueryStringKeys - Keys to manage (strings or config objects with transform/defaults)
 * @param route - Vue Router route reference, or `null` for router-agnostic mode
 *
 * @example
 * ```ts
 * // With Vue Router
 * const { initialValuesInQueryString, setValuesInQueryString } = useQueryString([
 *   { key: 'page', defaultValue: 1, transform: 'number' },
 *   { key: 'search', defaultValue: '' },
 * ], route);
 *
 * // Without Vue Router (router-agnostic)
 * const { initialValuesInQueryString, setValuesInQueryString } = useQueryString([
 *   { key: 'page', defaultValue: 1, transform: 'number' },
 * ], null);
 *
 * setValuesInQueryString({ page: 2, search: 'test' });
 * setValuesInQueryString({ page: 1 }, { replaceQueryString: true });
 * ```
 */
export const useQueryString = (handledQueryStringKeys: HandledQueryStringKeys, route: RouteLocationNormalizedLoaded | null) => {
    const getValuesFromQueryString: GetValuesFromQueryString = (
        specificHandledQueryStringKeys = handledQueryStringKeys
    ): ValuesInQueryStrings => {
        const urlQuery = getQueryFromUrl();
        const valuesFromUrl = extractValues(specificHandledQueryStringKeys, urlQuery);

        if (hasAnyHandledKey(specificHandledQueryStringKeys, urlQuery)) {
            return valuesFromUrl;
        }

        // Fallback to history state: Vue Router query string is not updated when History API changes the URL
        const historyState = window.history.state || {};
        const queryState = historyState[HISTORY_STATE_QUERY_KEY] || {};
        const valuesFromState = extractValues(specificHandledQueryStringKeys, queryState);

        if (Object.keys(queryState).length > 0) {
            const currentUrlQuery = getQueryFromUrl();
            const mergedQuery: Record<string, string> = { ...currentUrlQuery, ...normalizeQueryValues(valuesFromState) };
            removeEmptyValues(mergedQuery);

            const newUrl = buildUrlWithQuery(mergedQuery);
            window.history.replaceState(buildHistoryState(mergedQuery), '', newUrl);

            return valuesFromState;
        }

        return valuesFromUrl;
    };

    const setValuesInQueryString: SetValuesInQueryString = (
        values,
        options: SetValuesInQueryStringOptions = {}
    ) => {
        const { replaceQueryString = false, __forcePushState = false } = options;

        const currentQuery = getQueryFromUrl();
        const mergedQuery = (replaceQueryString
            ? { ...values }
            : { ...currentQuery, ...values }) as ValuesInQueryStrings;

        removeEmptyValues(mergedQuery);
        setQueryToUrl(mergedQuery, buildHistoryState(mergedQuery), __forcePushState);
    };

    // Frozen to preserve initial values regardless of subsequent query string changes
    const initialValuesInQueryString = Object.freeze(getValuesFromQueryString());

    return {
        getValuesFromQueryString,
        initialValuesInQueryString,
        setValuesInQueryString
    };
};
