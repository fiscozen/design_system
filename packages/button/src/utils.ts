import type { SizeToEnvironmentMap, IconSizeMap, ButtonSize } from './types'

/**
 * Maps deprecated ButtonSize to ButtonEnvironment
 * 
 * Used for backward compatibility when size prop is provided instead of environment.
 * All sizes map to environments: xs/sm/md → backoffice, lg → frontoffice
 */
export const sizeToEnvironmentMapping: SizeToEnvironmentMap = {
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
export const iconSizeMap: IconSizeMap = {
  xs: 'sm',
  sm: 'md',
  md: 'lg',
  lg: 'lg'
}

/**
 * Gap size configuration for button groups
 * 
 * Maps button sizes to Tailwind gap classes for spacing between buttons
 * in horizontal and vertical layouts.
 * 
 * @constant
 * @example
 * const gapClass = buttonGapConfig[props.size]; // 'gap-12' for 'md'
 */
export const buttonGapConfig: {
  [key in ButtonSize]: string
} = {
  xs: 'gap-8',
  sm: 'gap-10',
  md: 'gap-12',
  lg: 'gap-16'
}
