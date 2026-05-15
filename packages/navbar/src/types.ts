import { Breakpoint } from '@fiscozen/style'

export type FzNavbarVariant = 'horizontal' | 'vertical'

export type FzNavbarPosition = 'static' | 'fixed' | 'sticky'

interface FzNavbarProps {
  /**
   * The main direction of the navbar
   */
  variant?: FzNavbarVariant
  /**
   * Whether the main navigation menu is open (mobile). Supports v-model.
   */
  isMenuOpen?: boolean
  /**
   * @deprecated Use `mobileBreakpoint` instead. When both are passed, `mobileBreakpoint` takes precedence.
   *
   * Override breakpoints for managing custom size inside the navbar.
   */
  breakpoints?: Partial<Record<Breakpoint, `${number}px`>>
  /**
   * Width (in pixels) at and above which the navbar renders its desktop layout.
   * Below this value the compact mobile layout is used.
   *
   * Replaces the global mutation of `@fiscozen/style` breakpoints that consumers
   * used to perform to align with their own desktop threshold.
   */
  mobileBreakpoint?: number | `${number}px`
  /**
   * CSS positioning strategy applied to the root `<header>`. Replaces the need
   * for consumers to add `class="fixed top-0 left-0"` (or similar) on the call site.
   */
  position?: FzNavbarPosition
  /**
   * When `true`, the navbar adds `env(safe-area-inset-*)` to its top, left and right padding
   * so it renders correctly on devices with a notch / dynamic island.
   *
   * Defaults to `false` to preserve current visual behavior for existing consumers.
   */
  respectSafeArea?: boolean
}

type FzNavbarEmits = {
  'fznavbar:menuButtonClick': []
  'update:isMenuOpen': [value: boolean]
}

export type { FzNavbarProps, FzNavbarEmits }
