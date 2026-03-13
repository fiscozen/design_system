/**
 * Provide/inject helpers for sharing the Vue Router route with useQueryString consumers.
 *
 * Eliminates prop drilling: call provideQueryStringRoute() once at app level,
 * then any nested component can injectQueryStringRoute() to get the route
 * without receiving it as a prop.
 *
 * @module @fiscozen/composables/useQueryString/provider
 */

import type { InjectionKey } from 'vue';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import { provide, inject } from 'vue';

/**
 * Injection key for the shared Vue Router route instance.
 * Components that need query string sync inject this instead of receiving route as a prop.
 */
export const QUERY_STRING_ROUTE_KEY: InjectionKey<RouteLocationNormalizedLoaded> =
    Symbol('FzQueryStringRoute');

/**
 * Provides the Vue Router route to all descendants that use useQueryString.
 * Call once in the app root (e.g. App.vue) so nested components can inject it.
 *
 * @example
 * ```ts
 * // App.vue
 * import { provideQueryStringRoute } from '@fiscozen/composables'
 * import { useRoute } from 'vue-router'
 * provideQueryStringRoute(useRoute())
 * ```
 */
export const provideQueryStringRoute = (route: RouteLocationNormalizedLoaded): void => {
    provide(QUERY_STRING_ROUTE_KEY, route);
};

/**
 * Injects the Vue Router route provided by provideQueryStringRoute().
 * Returns null if no ancestor called provideQueryStringRoute(),
 * enabling router-agnostic fallback in useQueryString.
 */
export const injectQueryStringRoute = (): RouteLocationNormalizedLoaded | null => {
    return inject(QUERY_STRING_ROUTE_KEY, null);
};
