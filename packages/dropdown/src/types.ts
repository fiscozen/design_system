import { ButtonSize } from '@fiscozen/button'
import { FzActionProps, FzActionSectionProps } from '@fiscozen/action'
import { ButtonVariant } from '@fiscozen/button'
import { VNode } from 'vue'

type FzDropdownProps = {
  /**
   * @deprecated Use the environment prop instead
   * Size of the dropdown trigger
   */
  size?: ButtonSize

  /**
   * Environment of the dropdown trigger
   * @default 'frontoffice'
   */
  environment?: 'frontoffice' | 'backoffice'
  /**
   * @deprecated Declare your actions list inside the actionsList slot instead
   * List of actions
   */
  actions: (FzActionProps | (FzActionSectionProps & {type: 'section'}))[]
  /**
   * Whether to align to the left or right
   * @default 'center'
   */
  align?: 'left' | 'right' | 'center'
  /**
   * Whether to close the action list when an action is clicked
   */
  closeOnActionClick?: boolean
  /**
   * Class to apply to the actions list
   */
  listClass?: string
  /**
   * Whether opener is disabled
   */
  disabled?: boolean
  /**
   * Button variant
   * @default 'primary'
   */
  buttonVariant?: ButtonVariant,
  /**
   * Teleport floating to body
   * @default true
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
   * Actions list slot
   */
  actionList(): VNode | VNode[]
  /**
   *
   * Use this to replace the button opener entirely
   */
  opener(props: { isOpen: boolean, open: () => void, close: () => void }): VNode | VNode[]
}

export type FzIconDropdownProps = FzDropdownProps & {
  /**
   * icon name
   */
  iconName: string,
  hasNotification?: boolean
}

export type FzIconDropdownSlots = {
  /**
   * Actions list slot
   */
  actionList(): VNode | VNode[]
}

export type { FzDropdownProps, FzDropdownSlots }
