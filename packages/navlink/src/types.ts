import { IconSize } from '@fiscozen/icons/src/types'
import { RouteLocation } from 'vue-router'

export interface FzNavlinkProps<T = void> {
  iconName?: string
  iconSize?: IconSize
  label?: string
  disabled?: boolean
  meta?: T
}

type PartialExcept<T, K extends keyof T> = Pick<Required<T>, K> & Partial<T>

export type CustomRouteLocation = PartialExcept<RouteLocation, 'path' | 'name'>
export interface FzRouterNavlinkProps extends FzNavlinkProps<CustomRouteLocation> {}
