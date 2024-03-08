import { RouteLocation, RouterLinkProps } from 'vue-router'

export interface Breadcrumb<T = void> {
  id: string
  label: string
  metadata: T extends {} ? T : undefined
}

type PartialExcept<T, K extends keyof T> = Pick<Required<T>, K> & Partial<T>

export type CustomRouteLocation = PartialExcept<RouteLocation, 'path' | 'name'>
