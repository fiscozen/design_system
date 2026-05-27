import { Breakpoint } from '@fiscozen/style'
import { ButtonEnvironment } from '@fiscozen/button'

export type FzNavbarVariant = 'horizontal' | 'vertical'

export type FzNavbarPosition = 'static' | 'fixed' | 'sticky'

interface FzNavbarProps {
  /**
   * The main direction of the navbar.
   *
   * @deprecated The `'horizontal'` value is deprecated and will be removed in
   * a future major. The frontoffice three-column layout no longer renders a
   * horizontal navbar at the top of the page, and the vertical variant is the
   * supported direction going forward. New call sites should pass
   * `variant="vertical"`; existing consumers should plan a migration to the
   * three-column layout. Passing `'horizontal'` emits a dev-mode warning.
   */
  variant?: FzNavbarVariant
  /**
   * Sizing context for the navbar's internal default controls (currently the
   * mobile menu button). `'backoffice'` renders compact 32px controls; the
   * default `'frontoffice'` renders 44px touch-friendly controls. Consumers
   * who pass content via the `#menu-button` / `#user-menu` slots are
   * responsible for sizing that content themselves.
   */
  environment?: ButtonEnvironment
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
