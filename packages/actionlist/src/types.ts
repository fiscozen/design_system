import { FzRouterNavlinkProps, FzNavlinkProps } from '@fiscozen/navlink'

/**
 * @deprecated Use `@fiscozen/action` (`FzActionList` + `FzActionSection` + `FzAction`)
 * instead. This package is internal-only until `@fiscozen/table` migrates.
 * See the @fiscozen/actionlist README for the migration guide.
 */
type ActionlistItem<T = void> =
  | (FzRouterNavlinkProps & { type: 'link' })
  | (FzNavlinkProps<T> & { type: 'button' })

/**
 * @deprecated Use `@fiscozen/action` (`FzActionList` + `FzActionSection` + `FzAction`)
 * instead. This package is internal-only until `@fiscozen/table` migrates.
 * See the @fiscozen/actionlist README for the migration guide.
 */
interface FzActionlistProps<T = void> {
  label?: string
  items: ActionlistItem<T>[]
  listClass?: string
}

export { ActionlistItem, FzActionlistProps }
