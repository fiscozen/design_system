import { RouteLocation } from 'vue-router'

/**
 * A single breadcrumb item.
 *
 * The generic parameter T determines the shape of the metadata field,
 * which is forwarded as-is to the bread-label slot. When T is void (default),
 * metadata is undefined.
 */
export interface Breadcrumb<T = void> {
  id: string
  label: string
  metadata: T extends {} ? T : undefined
}

type PartialExcept<T, K extends keyof T> = Pick<Required<T>, K> & Partial<T>

/**
 * Partial RouteLocation requiring at least path or name.
 *
 * Used as the metadata type for FzRouterBreadcrumbs items — the value is
 * passed directly to :to on RouterLink.
 */
export type CustomRouteLocation = PartialExcept<RouteLocation, 'path' | 'name'>

/**
 * Environment determining breadcrumb rendering behaviour.
 *
 * - `frontoffice`: collapses trails longer than 3 items to first / … / penultimate / current
 * - `backoffice`: always shows all items regardless of count
 */
export type BreadcrumbEnvironment = 'frontoffice' | 'backoffice'

/**
 * A single entry in the computed display list produced by FzBreadcrumbs.
 *
 * FzBreadcrumbs iterates DisplayItem<T>[] rather than the raw breadcrumbs
 * array so that the ellipsis placeholder can be injected in frontoffice
 * overflow mode without mutating the consumer's data.
 */
export type DisplayItem<T> =
  | { kind: 'breadcrumb'; item: Breadcrumb<T>; isActive: boolean }
  | { kind: 'ellipsis' }

interface FzBreadcrumbsBaseProps {
  /**
   * Character or string rendered between items
   * @default '/'
   */
  separator?: string
  /**
   * Accessible label for the <nav> landmark.
   * Override when multiple navigation landmarks coexist on the same page (WCAG 2.4.1).
   * @default 'Breadcrumb'
   */
  ariaLabel?: string
  /**
   * Controls rendering behaviour based on environment.
   * frontoffice collapses trails longer than 3 items; backoffice always shows all items.
   * @default 'frontoffice'
   */
  environment?: BreadcrumbEnvironment
}

/**
 * Props for the FzBreadcrumbs component.
 *
 * Presentational, framework-agnostic component that renders any list of
 * breadcrumb items. Navigation behaviour is provided entirely via the
 * bread-label slot — the component itself has no router dependency.
 *
 * @example
 * ```vue
 * <FzBreadcrumbs :breadcrumbs="items" />
 * ```
 */
export interface FzBreadcrumbsProps<T> extends FzBreadcrumbsBaseProps {
  /**
   * List of breadcrumb items to render.
   * The component renders nothing when fewer than 2 items are provided.
   */
  breadcrumbs: Breadcrumb<T>[]
}

/**
 * Props for the FzRouterBreadcrumbs component.
 *
 * Vue Router–aware wrapper around FzBreadcrumbs. Generates breadcrumbs
 * automatically from route.matched when no breadcrumbs prop is provided.
 *
 * @example Automatic mode — breadcrumbs derived from the current route hierarchy
 * ```vue
 * <FzRouterBreadcrumbs />
 * ```
 *
 * @example Manual mode — explicit list, rendered as RouterLink items
 * ```vue
 * <FzRouterBreadcrumbs :breadcrumbs="items" />
 * ```
 */
export interface FzRouterBreadcrumbsProps extends FzBreadcrumbsBaseProps {
  /**
   * Explicit list of breadcrumbs. When omitted or empty, breadcrumbs are
   * generated automatically from route.matched using the route name as label
   * (falling back to path when the route has no name).
   */
  breadcrumbs?: Breadcrumb<CustomRouteLocation>[]
}
