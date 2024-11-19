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
}

type FzNavbarEmits = {
  'fznavbar:menuButtonClick': []
}

export type { FzNavbarProps, FzNavbarEmits }
