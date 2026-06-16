/**
 * @fiscozen/navlink
 *
 * @deprecated Deprecated for external use — internal-only until consumers migrate.
 * New code must use `@fiscozen/action` (`FzAction` with `variant="textLeft"`) instead:
 * `FzNavlink` maps to `FzAction` with `type="action"`, `FzRouterNavlink` maps to
 * `FzAction` with `type="link"`. This package stays published because
 * `@fiscozen/actionlist` and `@fiscozen/navlist` still depend on it.
 * See the package README for the migration guide.
 */
export { default as FzNavlink } from './FzNavlink.vue'
export { default as FzRouterNavlink } from './FzRouterNavlink.vue'

export * from './types'
