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
