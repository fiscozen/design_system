export type FzNavbarVariant = 'horizontal' | 'vertical'

interface FzNavbarProps {
  /**
   * The main direction of the navbar
   */
  variant: FzNavbarVariant
}

type FzNavbarEmits = {
  'fznavbar:menuButtonClick': []
}

export type { FzNavbarProps, FzNavbarEmits }
