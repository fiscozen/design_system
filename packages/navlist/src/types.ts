import { FzCollapseProps } from '@fiscozen/collapse'
import { FzNavlinkProps, FzRouterNavlinkProps } from '@fiscozen/navlink'

export type FzNavlistItem =
  | (FzRouterNavlinkProps & { type: 'link' })
  | (FzNavlinkProps & { type: 'button' })

export interface FzNavlistSub extends FzCollapseProps {
  subitems: FzNavlistItem[]
}

export interface FzNavlistSection {
  label: string
  items: (FzNavlistItem | FzNavlistSub)[]
}

/**
 * @deprecated Use `@fiscozen/action` (`FzActionList` + `FzActionSection` +
 * `FzAction`) instead. Collapsible submenus must be implemented with
 * `FzCollapse` from `@fiscozen/collapse` in the consumer code.
 * See the @fiscozen/navlist README for the migration guide.
 */
export interface FzNavlistProps {
  sections: FzNavlistSection[]
}

export const isSubMenu = (item: FzNavlistItem | FzNavlistSub): item is FzNavlistSub => {
  return 'subitems' in item
}
