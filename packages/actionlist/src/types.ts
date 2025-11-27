import { FzRouterNavlinkProps, FzNavlinkProps } from '@fiscozen/navlink'

type ActionlistItem<T = void> =
  | (FzRouterNavlinkProps & { type: 'link' })
  | (FzNavlinkProps<T> & { type: 'button' })

interface FzActionlistProps<T = void> {
  label?: string;
  items: ActionlistItem<T>[];
  listClass?: string;
}

export { ActionlistItem, FzActionlistProps }
