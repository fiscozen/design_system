import { IconSize, IconVariant } from '@fiscozen/icons/src/types'
import { RouteLocation } from 'vue-router'

/**
 * @deprecated Use `@fiscozen/action` `FzAction` (with `type="action"` and
 * `variant="textLeft"`) instead. This package is internal-only until
 * `@fiscozen/actionlist` and `@fiscozen/navlist` migrate.
 * See the @fiscozen/navlink README for the migration guide.
 */
export interface FzNavlinkProps<T = void> {
  /**
   * Name of the fontawesome icon
   */
  iconName?: string
  /**
   * Size of the fontawesome icon
   */
  iconSize?: IconSize
  /**
   * Variant of the fontawesome icon
   */
  iconVariant?: IconVariant
  /**
   * Alternative prop to default label slot
   */
  label?: string
  /**
   * Disables the link
   */
  disabled?: boolean
  /**
   * Metadata
   */
  meta?: T
}

type PartialExcept<T, K extends keyof T> = Pick<Required<T>, K> & Partial<T>

export type CustomRouteLocation = PartialExcept<RouteLocation, 'path' | 'name'>
type FzRouterNavlinkPropsType = Required<Pick<FzNavlinkProps<CustomRouteLocation>, 'meta'>> &
  FzNavlinkProps<CustomRouteLocation>
/**
 * @deprecated Use `@fiscozen/action` `FzAction` (with `type="link"` and
 * `variant="textLeft"`) instead. Pass the vue-router target via the `to` prop.
 * See the @fiscozen/navlink README for the migration guide.
 */
export interface FzRouterNavlinkProps extends FzRouterNavlinkPropsType {}
