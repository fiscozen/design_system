import { FzCollapseProps } from '@fiscozen/collapse'
import { FzRouterNavlinkProps } from '@fiscozen/navlink'

export interface FzNavlistSub extends FzCollapseProps {
  subitems: FzRouterNavlinkProps[]
}

export interface FzNavlistSection {
  label: string
  items: (FzRouterNavlinkProps | FzNavlistSub)[]
}

export interface FzNavlistProps {
  sections: FzNavlistSection[]
}
 
export const isSubMenu = (item: FzRouterNavlinkProps | FzNavlistSub): item is FzNavlistSub => {
  return Boolean((item as FzNavlistSub).subitems)
}