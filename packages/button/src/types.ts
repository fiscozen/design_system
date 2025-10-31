/**
 * Type definitions for the Fiscozen Button component library.
 * 
 * @module @fiscozen/button/types
 */

import type { IconVariant, IconSize } from '@fiscozen/icons'

export type CommonButtonVariant = 'primary' | 'secondary' | 'invisible'
export type IconButtonVariant = CommonButtonVariant | 'notification'
export type ButtonVariant = CommonButtonVariant | 'danger' | 'success'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'
export type ButtonEnvironment = 'backoffice' | 'frontoffice'

/**
 * Type for size to environment mapping record
 */
export type SizeToEnvironmentMap = Record<ButtonSize, ButtonEnvironment>

/**
 * Type for button size to icon size mapping record
 */
export type IconSizeMap = Record<ButtonSize, IconSize>

/**
 * Props for the FzButton component.
 * 
 * A comprehensive button component supporting five visual variants and two environment-based sizes.
 * Features include icon integration, multiple interactive states, and full accessibility support.
 * 
 * @example
 * <FzButton label="Click me" variant="primary" />
 */
export interface FzButtonProps {
  /**
   * Text label displayed on the button. Overridden by default slot if provided.
   */
  label?: string
  /**
   * @deprecated Use FzTooltip component to wrap the button instead.
   * A runtime warning will be displayed when this prop is used.
   */
  tooltip?: string
  /**
   * Visual style variant determining colors and interactive states
   * @default 'primary'
   */
  variant?: ButtonVariant
  /**
   * Button size affecting height, padding, and text size
   * @deprecated Use the 'environment' prop instead. This prop will be removed in a future version.
   */
  size?: ButtonSize
  /**
   * Environment determining button size
   * @default 'frontoffice'
   */
  environment?: ButtonEnvironment
  /**
   * Disables interaction and applies disabled styling
   * @default false
   */
  disabled?: boolean
  /**
   * FontAwesome icon name (e.g., 'bell', 'save'). Search: https://fontawesome.com/v6/icons
   */
  iconName?: string
  /**
   * FontAwesome icon variant (e.g., 'fas', 'far', 'fal')
   */
  iconVariant?: IconVariant
  /**
   * Icon position relative to label
   * @default 'before'
   */
  iconPosition?: 'before' | 'after'
  /**
   * Additional CSS classes for label container. Merged with 'truncate' unless overrideContainerClass is true.
   */
  containerClass?: string
  /**
   * Replaces default container classes with containerClass instead of merging
   * @default false
   */
  overrideContainerClass?: boolean
}

/**
 * Props for the FzIconButton component.
 * 
 * Icon-only button variant with notification badge support.
 * 
 * @example
 * <FzIconButton iconName="bell" variant="notification" />
 */
export interface FzIconButtonProps {
  /**
   * The tooltip of the button will be shown on hover
   */
  tooltip?: string
  /**
   * primary or secondary button
   * @default 'primary'
   */
  variant?: IconButtonVariant
  /**
   * size of the button
   * @default 'md'
   */
  size?: ButtonSize
  /**
   * whether action is enabled or not
   * @default false
   */
  disabled?: boolean
  /**
   * Icon to be displayed. Use fontawesome search here https://fontawesome.com/v6/icons
   * Mind that not all of the icons and variants might be available.
   */
  iconName: string
  /**
   * Fontawesome icon variant: solid, regular, light, thin. Sharp subvariants are available as well
   * @default 'far'
   */
  iconVariant?: IconVariant
  /**
   * Icon size
   */
  iconSize?: IconSize
  /**
   * Positioning of the icon
   * @default 'before'
   */
  iconPosition?: 'before' | 'after'
  /**
   * Additional class for the icon
   * @default ''
   */
  iconClass?: string
}

/**
 * Props for the FzButtonGroup component.
 * 
 * Container component for grouping multiple buttons with consistent spacing.
 * 
 * @example
 * <FzButtonGroup horizontal :gap="true">
 *   <FzButton label="Save" />
 *   <FzButton label="Cancel" />
 * </FzButtonGroup>
 */
export interface FzButtonGroupProps {
  /**
   * The direction of the button group. If true, buttons will be displayed horizontally, otherwise vertically
   * @default true
   */
  horizontal?: boolean
  /**
   * Whether to add a gap between buttons
   */
  gap?: boolean
  /**
   * The gap size between buttons
   * @default 'md'
   */
  size?: ButtonSize
}
