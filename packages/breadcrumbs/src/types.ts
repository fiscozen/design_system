import { RouteLocation, RouterLinkProps } from 'vue-router'



export interface Breadcrumb<T = void> {
  id: string
  label: string
  metadata: T extends {} ? T : undefined
}

type PartialExcept<T, K extends keyof T> = Pick<Required<T>, K> & Partial<T>

export type CustomRouteLocation = PartialExcept<RouteLocation, 'path' | 'name'>

export interface FzRouterBreadcrumbsProps {
  /**
   * List of breadcrumbs. If you don't pass this prop the
   * component will generate automatic breadcrumbs based on
   * the route object
   */
  breadcrumbs?: Breadcrumb<CustomRouteLocation>[]
  /**
   * Breadcrumb separator symbol
   */
  separator?: string
}

export interface FzBreadcrumbsProps<T> {
  /**
   * List of breadcrumbs
   */
  breadcrumbs: Breadcrumb<T>[]
  /**
   * Breadcrumb separator symbol
   */
  separator?: string
}
