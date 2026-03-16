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
    flattenQuery,
} from './utils';

import { extractValues, hasAnyHandledKey } from './transform';
import { injectQueryStringRoute } from './provider';

export type * from './types';
export { provideQueryStringRoute, injectQueryStringRoute, QUERY_STRING_ROUTE_KEY } from './provider';

/**
 * Type-safe URL query parameter management with History API synchronization.
 *
 * Vue Router re-mounts components when query params change via `router.push()`
 * or `router.replace()`, so this composable bypasses the router and writes
 * directly to the History API (`replaceState`/`pushState`). As a consequence,
 * `route.query` is never updated by the router and becomes stale after the
 * first write. Both reads and writes therefore use `window.location.search`
 * as the single source of truth (see `_useRouteQueryAsMergeBase`).
 *
 * Values are also persisted in `window.history.state` so they survive
 * Vue Router navigations that would otherwise strip unknown query params.
 *
 * @param handledQueryStringKeys - Keys to manage (strings or config objects with transform/defaults)
 * @param route - `undefined` to auto-inject from `provideQueryStringRoute()`,
 *   a `RouteLocationNormalizedLoaded` (reserved for future use), or `null` for
 *   router-agnostic mode. Currently does not affect read/write behavior.
 *
 * @example
 * ```ts
 * const { initialValuesInQueryString, setValuesInQueryString } = useQueryString([
 *   { key: 'page', defaultValue: 1, transform: 'number' },
 * ]);
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
            const mergedQuery = removeEmptyValues({ ...urlQuery, ...normalizeQueryValues(valuesFromState) });

            const newUrl = buildUrlWithQuery(mergedQuery as Record<string, string>);
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

        // Intentionally disabled. Vue Router's route.query does not update after
        // direct History API calls (replaceState/pushState) that this composable
        // uses to avoid component re-mounting. Using the stale route.query as
        // merge base causes consecutive setValuesInQueryString calls to silently
        // revert previously written values. Always read the live URL instead.
        // Re-enable when Vue Router supports non-re-mounting query updates.
        const _useRouteQueryAsMergeBase = false;
        const currentQuery = _useRouteQueryAsMergeBase && resolvedRoute
            ? flattenQuery(resolvedRoute.query)
            : getQueryFromUrl();
        const mergedQuery = removeEmptyValues(
            (replaceQueryString
                ? { ...values }
                : { ...currentQuery, ...values }) as ValuesInQueryStrings
        );

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
