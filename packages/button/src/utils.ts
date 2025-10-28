import { ButtonSize, ButtonEnvironment } from './types'
import { IconSize } from '@fiscozen/icons'

/**
 * Maps deprecated ButtonSize to ButtonEnvironment
 * 
 * Used for backward compatibility when size prop is provided instead of environment.
 * All sizes map to environments: xs/sm/md → backoffice, lg → frontoffice
 */
export const sizeToEnvironmentMapping: Record<ButtonSize, ButtonEnvironment> = {
  xs: 'backoffice',
  sm: 'backoffice',
  md: 'backoffice',
  lg: 'frontoffice'
}

/**
 * Maps ButtonSize to IconSize for FzIconButton
 * 
 * Used by FzIconButton to determine icon size based on button size.
 */
export const iconSizeMap: Record<ButtonSize, IconSize> = {
  xs: 'sm',
  sm: 'md',
  md: 'lg',
  lg: 'lg'
}

/**
 * Button environment configuration mapping
 * 
 * Defines all size-related values for each button environment to maintain consistent proportions.
 * - height: fixed button height in px/tailwind units (includes padding)
 * - paddingX: horizontal padding (always applied)
 * - minWidth: minimum button width
 * 
 * Note: Spacing between icon and label (8px) is handled by gap-8 on the button element.
 */
export const buttonEnvironmentConfig = {
  backoffice: { height: 32, paddingX: 12, minWidth: 96 },
  frontoffice: { height: 44, paddingX: 12, minWidth: 96 }
} as const
