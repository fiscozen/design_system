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

export interface FzNavlistProps {
  sections: FzNavlistSection[]
}

export const isSubMenu = (item: FzNavlistItem | FzNavlistSub): item is FzNavlistSub => {
  return 'subitems' in item
}
