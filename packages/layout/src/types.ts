type FzLayoutProps = {
  layout:
    | 'oneColumn'
    | 'oneColumnHeader'
    | 'twoColumns'
    | 'leftShoulder'
    | 'multipleAreas'
    | 'rightShoulder'
    | 'threeColumns'
  isViewport?: boolean
  hasBottomBar?: boolean
  /**
   * Opt out of the default `p-12` padding applied to every region.
   * Padding is on by default to preserve the existing spacing of current
   * consumers; set to `true` for full-bleed regions (e.g. page templates that
   * own their own padding).
   *
   * Note: scrollable regions (`fz-layout__main`/`left`/`right`/`sidebar` under
   * `fz-layout__overflow`) clip content at their edges (`overflow-auto`). With
   * padding removed, the consumer owns keeping focusable content clear of those
   * edges — add your own spacing (or `scroll-margin`) so keyboard focus rings
   * are not clipped against a scroll boundary.
   */
  disablePadding?: boolean
}

/**
 * How a region aligns its content within its own block.
 *
 * - `stretch` (default): children fill the region's inline size and flow from
 *   the top — the neutral behaviour for a normal content column.
 * - `top`: children are centered on the inline axis and pinned to the top.
 * - `center`: children are centered on both axes — the shape a login/auth or
 *   empty-state screen wants inside a full-height page.
 */
type FzLayoutAlign = 'stretch' | 'top' | 'center'

/**
 * Props for `FzLayoutMain` — the "main" region molecule.
 *
 * A presentation-only wrapper for a page's primary content region. It renders a
 * semantic landmark (`<main>` by default) and centralises the region-level
 * concerns page templates need, so those concerns are declared in one place
 * instead of being re-implemented ad hoc in every app layout.
 */
type FzLayoutMainProps = {
  /**
   * The element/tag the region renders as. Defaults to `main` so the region is
   * a `main` landmark for assistive technology. Override (e.g. to `div`) only
   * when the region is not the document's primary content — a page must not
   * expose more than one `main` landmark.
   * @default 'main'
   */
  as?: 'main' | 'div'
  /**
   * Content alignment within the region's block.
   * @default 'stretch'
   * @see FzLayoutAlign
   */
  align?: FzLayoutAlign
  /**
   * Pad the region by the device safe-area insets (`env(safe-area-inset-*)`),
   * keeping content clear of notches, rounded corners and home indicators on
   * mobile/Capacitor. Centralises the safe-area handling that today is copied
   * ad hoc across app layouts. Insets resolve to `0` on platforms without them.
   * @default false
   */
  safeArea?: boolean
}

/**
 * Slots for `FzLayoutMain`.
 */
type FzLayoutMainSlots = {
  /** The region's content. */
  default(props: {}): any
}

/**
 * Props for `FzBlankTemplate` — the full-bleed, no-chrome page template.
 *
 * The minimal page shell: a single full-height content region and nothing else
 * (no nav, header, aside, footer or bottom bar). Used for auth/login screens
 * and standalone tools that render their own self-contained UI. It owns a
 * full-height root, so it does not depend on app-global `height`/`overflow`
 * CSS being present (RFC §6.2).
 */
type FzBlankTemplateProps = {
  /**
   * Where the content sits within the full-height page.
   * @default 'center'
   */
  align?: 'center' | 'top'
}

/**
 * Slots for `FzBlankTemplate`.
 */
type FzBlankTemplateSlots = {
  /** The page content (e.g. a login card or standalone tool). */
  default(props: {}): any
}

/**
 * Props shared by the thin semantic region wrappers (`FzLayoutHeader`,
 * `FzLayoutAside`, `FzLayoutFooter`). Each renders a landmark element and a
 * stable class hook; layout-specific sizing/padding is applied by the composing
 * template via fall-through attributes.
 */
type FzLayoutRegionProps<TTag extends string = string> = {
  /**
   * The element/tag the region renders as. Defaults to the region's landmark
   * element. Override (e.g. to `div`) when the page must not expose that
   * landmark more than once. Typed per region to the landmark element or `div`,
   * so an invalid override is caught at compile time.
   */
  as?: TTag
}

/**
 * Slots shared by the thin semantic region wrappers.
 */
type FzLayoutRegionSlots = {
  /** The region's content. */
  default(props: {}): any
}

/**
 * Props for `FzLayoutHeader` — the top-bar region (`<header>` banner by default).
 */
type FzLayoutHeaderProps = FzLayoutRegionProps<'header' | 'div'>
/** Slots for `FzLayoutHeader`. */
type FzLayoutHeaderSlots = FzLayoutRegionSlots

/**
 * Props for `FzLayoutAside` — the complementary region (`<aside>` by default).
 */
type FzLayoutAsideProps = FzLayoutRegionProps<'aside' | 'div'>
/** Slots for `FzLayoutAside`. */
type FzLayoutAsideSlots = FzLayoutRegionSlots

/**
 * Props for `FzLayoutFooter` — the footer region (`<footer>` contentinfo by default).
 */
type FzLayoutFooterProps = FzLayoutRegionProps<'footer' | 'div'>
/** Slots for `FzLayoutFooter`. */
type FzLayoutFooterSlots = FzLayoutRegionSlots

/**
 * Content chrome for the flow templates.
 *
 * - `card`: the content sits in a contained, max-width card (the shape an
 *   onboarding flow uses).
 * - `flat`: the content is full-bleed with no card frame — makes today's
 *   implicit "auth" branch an explicit variant (RFC §4).
 */
type FzFocusChrome = 'card' | 'flat'

/**
 * Props for `FzFocusTemplate` — the distraction-reduced flow template.
 *
 * A centered, low-chrome page shell for guided flows (onboarding) and auth
 * screens. Optional `topbar`, `aside` and `footer` regions frame a centered
 * main region. Owns a full-height root, so it does not depend on app-global
 * `height`/`overflow` CSS (RFC §6.2).
 */
type FzFocusTemplateProps = {
  /**
   * How the centered content is framed.
   * @default 'card'
   * @see FzFocusChrome
   */
  chrome?: FzFocusChrome
}

/**
 * Slots for `FzFocusTemplate`.
 */
type FzFocusTemplateSlots = {
  /** Optional top bar (e.g. logo, step indicator, exit/close). */
  topbar?(props: {}): any
  /** The centered flow content. */
  default(props: {}): any
  /** Optional complementary panel (e.g. support chat). */
  aside?(props: {}): any
  /** Optional footer (e.g. legal links). */
  footer?(props: {}): any
}

/**
 * Slots for `FzLayoutBottomBar` — the sticky bottom action-bar region.
 */
type FzLayoutBottomBarSlots = {
  /**
   * The bar content (e.g. primary/secondary actions). Content should set its
   * own `pointer-events` — the region container is `pointer-events: none` so
   * taps pass through the empty gutters; direct children are re-enabled.
   */
  default(props: {}): any
}

/**
 * Content frame for `FzAppTemplate`'s main region.
 *
 * - `card`: the primary content sits in a contained, max-width white card (the
 *   frontoffice standard-layout shape).
 * - `flat`: full-bleed content with no card frame.
 */
type FzAppChrome = 'card' | 'flat'

/**
 * Width of `FzAppTemplate`'s main content column.
 *
 * - `standard` (default): a readable, centered max-width column.
 * - `wide`: the standard max-width up to the largest breakpoint, then unbounded
 *   — the single content-width API that replaces the app's dead `wideLayout`
 *   flag (RFC §4/§7). Do not add a second parallel width prop.
 * - `full`: full-bleed, no max-width.
 */
type FzAppContentWidth = 'standard' | 'wide' | 'full'

/**
 * Toggle state + actions the template exposes to its `nav`, `header` and `aside`
 * slots, so the app's injected chrome (a hamburger, a chat button, …) can drive
 * the responsive nav/aside without owning the responsive state itself (RFC §4).
 */
type FzAppTemplateToggles = {
  /** `true` from the `desktop` breakpoint (1200px) up. */
  isDesktop: boolean
  /** Whether the nav is open. Always effectively open on desktop (the rail). */
  navOpen: boolean
  /** Open/close the nav. Pass a boolean to force a state; omit to toggle. */
  toggleNav: (force?: boolean) => void
  /** Whether the aside is open. */
  asideOpen: boolean
  /** Open/close the aside. Pass a boolean to force a state; omit to toggle. */
  toggleAside: (force?: boolean) => void
}

/**
 * Props for `FzAppTemplate` — the persistent-nav application shell.
 *
 * The full-chrome page template: a persistent navigation region, an optional
 * sticky header, the primary content, an optional complementary aside, an
 * optional sticky bottom action bar, and an optional footer. Regions are placed
 * responsively — on desktop the nav is a left rail and the aside a right panel;
 * below the `desktop` breakpoint both collapse into modal drawers. Owns a
 * full-height root, so it does not depend on app-global `height`/`overflow` CSS
 * (RFC §6.2).
 *
 * Presentation-only: it holds responsive/toggle state and safe-area/sticky CSS
 * but imports no store/router/API. The rail widths are a function of the
 * *injected* nav/aside content, never the template (RFC §4/§10).
 */
type FzAppTemplateProps = {
  /**
   * Render the complementary `aside` region (a side panel on desktop, a modal
   * drawer on mobile). Off by default so a shell without an aside stays lean.
   * @default false
   */
  hasAside?: boolean
  /**
   * Render the sticky bottom-bar region and `provide()` its teleport target
   * (`FZ_BOTTOM_BAR_TARGET`). The region self-collapses to zero height when it
   * has no content, so this can stay on even for pages that rarely show a bar;
   * set it to `false` to omit the region (and the provide) entirely.
   * @default true
   */
  hasBottomBar?: boolean
  /**
   * How the main content is framed.
   * @default 'card'
   * @see FzAppChrome
   */
  chrome?: FzAppChrome
  /**
   * Width of the main content column.
   * @default 'standard'
   * @see FzAppContentWidth
   */
  contentWidth?: FzAppContentWidth
  /**
   * Accessible name for the nav when it is a modal drawer (mobile). Ignored for
   * the desktop rail (the injected nav owns its own labelling there).
   */
  navLabel?: string
  /**
   * Accessible name for the aside when it is a modal drawer (mobile). Ignored
   * for the desktop panel.
   */
  asideLabel?: string
}

/**
 * Slots for `FzAppTemplate`. The chrome slots receive the responsive toggle
 * props (`FzAppTemplateToggles`).
 */
type FzAppTemplateSlots = {
  /** Persistent navigation (left rail on desktop, modal drawer on mobile). */
  nav?(props: FzAppTemplateToggles): any
  /** Optional sticky top bar (page title, actions, mobile hamburger/chat toggles). */
  header?(props: FzAppTemplateToggles): any
  /** The page's primary content. */
  default(props: {}): any
  /** Optional complementary panel (right panel on desktop, modal drawer on mobile). */
  aside?(props: FzAppTemplateToggles): any
  /** Optional sticky bottom action bar. */
  bottomBar?(props: {}): any
  /** Optional footer below the content. */
  footer?(props: {}): any
}

export type {
  FzLayoutProps,
  FzLayoutAlign,
  FzLayoutMainProps,
  FzLayoutMainSlots,
  FzBlankTemplateProps,
  FzBlankTemplateSlots,
  FzLayoutRegionProps,
  FzLayoutRegionSlots,
  FzLayoutHeaderProps,
  FzLayoutHeaderSlots,
  FzLayoutAsideProps,
  FzLayoutAsideSlots,
  FzLayoutFooterProps,
  FzLayoutFooterSlots,
  FzFocusChrome,
  FzFocusTemplateProps,
  FzFocusTemplateSlots,
  FzLayoutBottomBarSlots,
  FzAppChrome,
  FzAppContentWidth,
  FzAppTemplateToggles,
  FzAppTemplateProps,
  FzAppTemplateSlots
}
