import { Breakpoint } from '@fiscozen/style'

export type FzNavbarVariant = 'horizontal' | 'vertical'

interface FzNavbarProps {
  /**
   * The main direction of the navbar
   */
  variant: FzNavbarVariant
  /**
   * Whether the main navigation menu is open (mobile)
   */
  isMenuOpen?: boolean
  /**
   * Override breakpoint for manage custom size inside navbar
   */
  breakpoints?: Partial<Record<Breakpoint, `${number}px`>>
}

type FzNavbarEmits = {
  'fznavbar:menuButtonClick': []
}

export type { FzNavbarProps, FzNavbarEmits }
