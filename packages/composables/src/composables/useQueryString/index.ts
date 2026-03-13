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
import { injectQueryStringRoute } from './provider';

export type * from './types';
export { provideQueryStringRoute, injectQueryStringRoute, QUERY_STRING_ROUTE_KEY } from './provider';

/**
 * Manages URL query parameters with type-safe extraction and History API synchronization.
 *
 * Bridges the gap between Vue Router's `route.query` (read-only, not updated by
 * direct History API calls) and the need to read/write typed query params.
 * Values are persisted in both the URL and history state to survive
 * Vue Router navigation quirks.
 *
 * The `route` parameter controls how existing query params are read during writes:
 * - **omitted** (default): auto-injects the route from `provideQueryStringRoute()`.
 *   Falls back to router-agnostic mode if no provider exists.
 * - **RouteLocationNormalizedLoaded**: uses that specific route instance.
 * - **null**: forces router-agnostic mode (pure History API via `window.location`).
 *
 * @param handledQueryStringKeys - Keys to manage (strings or config objects with transform/defaults)
 * @param route - Vue Router route, `null` for router-agnostic, or omit to auto-inject
 *
 * @example
 * ```ts
 * // Auto-inject from provider (recommended)
 * const { initialValuesInQueryString, setValuesInQueryString } = useQueryString([
 *   { key: 'page', defaultValue: 1, transform: 'number' },
 * ]);
 *
 * // Explicit route
 * const { ... } = useQueryString([...], route);
 *
 * // Force router-agnostic
 * const { ... } = useQueryString([...], null);
 * ```
 */
export const useQueryString = (
    handledQueryStringKeys: HandledQueryStringKeys,
    route?: RouteLocationNormalizedLoaded | null
) => {
    const resolvedRoute = route === undefined ? injectQueryStringRoute() : route;
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

        const currentQuery = resolvedRoute ? resolvedRoute.query : getQueryFromUrl();
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
