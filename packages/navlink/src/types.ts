import { IconSize } from '@fiscozen/icons/src/types'
import { RouteLocation } from 'vue-router'

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
   * Set to true for icon only links
   */
  iconOnly?: boolean
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
export interface FzRouterNavlinkProps extends FzNavlinkProps<CustomRouteLocation> {}
