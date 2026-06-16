/**
 * @fiscozen/navlist
 *
 * @deprecated Deprecated for external use. New code must use `@fiscozen/action`
 * (`FzActionList` + `FzActionSection` + `FzAction`) instead. Collapsible
 * submenus (`FzNavlistSub`) have no direct equivalent in `@fiscozen/action`:
 * wrap a nested `FzActionSection` in a `FzCollapse` from `@fiscozen/collapse`
 * yourself. No `@fiscozen/*` package depends on this one, but it remains
 * published for backward compatibility. See the package README for the
 * migration guide.
 */
export { default as FzNavlist } from './FzNavlist.vue'

export * from './types'
