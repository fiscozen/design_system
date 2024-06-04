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
