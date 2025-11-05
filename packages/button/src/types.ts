/**
 * Type definitions for the Fiscozen Button component library.
 * 
 * @module @fiscozen/button/types
 */

import type { IconVariant, IconSize } from '@fiscozen/icons'

export type CommonButtonVariant = 'primary' | 'secondary' | 'invisible'
export type IconButtonVariant = CommonButtonVariant
export type ButtonVariant = CommonButtonVariant | 'danger' | 'success'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'
export type ButtonEnvironment = 'backoffice' | 'frontoffice'

/**
 * Type for size to environment mapping record
 */
export type SizeToEnvironmentMap = Record<ButtonSize, ButtonEnvironment>

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
 * Icon-only button variant with notification badge support. Ideal for compact interfaces
 * and toolbars where space is limited. Features multiple variants, customizable icon sizes,
 * and full accessibility support.
 * 
 * @example Basic usage
 * ```vue
 * <FzIconButton iconName="bell" />
 * ```
 * 
 * @example With notification badge
 * ```vue
 * <FzIconButton iconName="bell" hasNotification />
 * ```
 * 
 * @example With accessibility label
 * ```vue
 * <FzIconButton iconName="settings" ariaLabel="Open settings" />
 * ```
 */
export interface FzIconButtonProps {
  /**
   * @deprecated Use FzTooltip component to wrap the button instead.
   * A runtime warning will be displayed when this prop is used.
   * Tooltip text shown on hover. Used as fallback for aria-label if ariaLabel is not provided.
   */
  tooltip?: string
  /**
   * Visual style variant determining colors and interactive states
   * @default 'primary'
   */
  variant?: IconButtonVariant
  /**
   * Environment determining button size
   * @default 'frontoffice'
   */
  environment?: ButtonEnvironment
  /**
   * Button size affecting dimensions and icon size
   * @deprecated Use the 'environment' prop instead. This prop will be removed in a future version.
   */
  size?: ButtonSize
  /**
   * Disables interaction and applies disabled styling
   * @default false
   */
  disabled?: boolean
  /**
   * FontAwesome icon name (e.g., 'bell', 'settings'). Search: https://fontawesome.com/v6/icons
   * Mind that not all of the icons and variants might be available.
   */
  iconName: string
  /**
   * FontAwesome icon variant (e.g., 'fas', 'far', 'fal', 'fat')
   * @default 'far'
   */
  iconVariant?: IconVariant
  /**
   * Custom icon size
   * @deprecated This prop will be removed in a future version. Icon size has now a fixed dimension.
   */
  iconSize?: IconSize
  /**
   * Shows a notification badge in the top-right corner of the button
   * @default false
   */
  hasNotification?: boolean
  /**
   * Accessible label for screen readers. Required for icon-only buttons.
   * If hasNotification is true, automatically appends notification status to the label.
   */
  ariaLabel?: string
}

/**
 * Props for the FzButtonGroup component.
 * 
 * Container for grouping buttons in a horizontal layout with fixed spacing.
 * Component always displays buttons horizontally with 16px gap.
 * 
 * @example
 * <FzButtonGroup>
 *   <FzButton>Button 1</FzButton>
 *   <FzButton>Button 2</FzButton>
 * </FzButtonGroup>
 */
export interface FzButtonGroupProps {
  /**
   * @deprecated This prop is deprecated and will be removed in a future version.
   * Component is always horizontal. Layout orientation cannot be changed.
   */
  horizontal?: boolean
  /**
   * @deprecated This prop is deprecated and will be removed in a future version.
   * Component always uses fixed gap spacing. Gap cannot be disabled.
   */
  gap?: boolean
  /**
   * @deprecated This prop is deprecated and will be removed in a future version.
   * Component always uses fixed gap size. Size cannot be configured.
   */
  size?: ButtonSize
}
