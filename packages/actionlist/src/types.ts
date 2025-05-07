import { FzRouterNavlinkProps, FzNavlinkProps } from '@fiscozen/navlink'

type ActionlistItem =
  | (FzRouterNavlinkProps & { type: 'link' })
  | (FzNavlinkProps & { type: 'button' })

interface FzActionlistProps {
  label?: string;
  items: ActionlistItem[];
  listClass?: string;
}

export { ActionlistItem, FzActionlistProps }
