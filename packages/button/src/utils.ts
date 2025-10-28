import { ButtonSize } from './types'
import { IconSize } from '@fiscozen/icons'

export const iconSizeMap: {
  [key in ButtonSize]: IconSize
} = {
  xs: 'sm',
  sm: 'md',
  md: 'lg',
  lg: 'lg'
}

/**
 * Button size configuration mapping
 * 
 * Defines all size-related values for each button size to maintain consistent proportions.
 * - height: button height in px/tailwind units (h-24 = 96px, h-28 = 112px, etc.)
 * - textSize: text size class (text-xs, text-sm, text-lg) or null if no override
 * - padding: horizontal padding when no icon is present
 * - iconPadding: horizontal padding when icon and label are both present
 * - iconMargin: spacing between icon and label
 */
export const buttonSizeConfig = {
  xs: { height: 24, textSize: 'xs', padding: 12, iconPadding: 8, iconMargin: 4 },
  sm: { height: 28, textSize: 'sm', padding: 14, iconPadding: 10, iconMargin: 4 },
  md: { height: 32, textSize: null, padding: 16, iconPadding: 10, iconMargin: 6 },
  lg: { height: 40, textSize: 'lg', padding: 20, iconPadding: 12, iconMargin: 8 }
} as const
