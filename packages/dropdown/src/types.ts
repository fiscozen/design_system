import { ButtonSize } from '@fiscozen/button'
import { FzActionlistProps } from '@fiscozen/actionlist'
import { IconButtonVariant } from '@fiscozen/button'
import { VNode } from 'vue'

type FzDropdownProps = {
  /**
   * Size of the dropdown trigger
   */
  size?: ButtonSize
  /**
   * Label of the action list
   */
  actionsLabel?: string
  /**
   * List of actions
   */
  actions: FzActionlistProps['items']
  /**
   * Whether to align to the left or right
   */
  align?: 'left' | 'right' | 'center'
  /**
   * Whether to close the action list when an action is clicked
   */
  closeOnActionClick?: boolean
  /**
   * Whether opener is disabled
   */
  openerDisabled?: boolean
  /**
   * Class binded to opener
   */
  openerClass?: string
  /**
   * teleport floating to body
   */
  teleport?: boolean
}

type FzDropdownSlots = {
  /**
   *
   * Label of the standard button opener
   */
  default(props: { isOpen: boolean }): VNode | VNode[]
  /**
   *
   * Use this to replace the button opener entirely
   */
  opener(props: { isOpen: boolean }): VNode | VNode[]
}

interface FzIconDropdownProps extends FzDropdownProps {
  /**
   * icon name
   */
  iconName: string
  /**
   * button variant
   */
  buttonVariant?: IconButtonVariant
}

export type { FzDropdownProps, FzDropdownSlots, FzIconDropdownProps }
