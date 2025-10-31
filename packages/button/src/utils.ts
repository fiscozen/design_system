import type { SizeToEnvironmentMap, IconSizeMap } from './types'

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
