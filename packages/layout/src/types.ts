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
 * Where the `filters` rail sits relative to the list content.
 *
 * - `left` (default): a fixed-width rail beside the content from `md` up,
 *   stacking above it on narrow viewports — the dominant backoffice list shape.
 * - `top`: a full-width filter row above the content at every width — for pages
 *   whose filters read as a horizontal bar rather than a rail.
 */
type FzListFiltersPosition = 'left' | 'top'

/**
 * Props for `FzListTemplate` — the backoffice list-page layout.
 *
 * A presentation-only page-content layout for list pages: an optional `banner`,
 * an optional `filters` rail, an optional `header` toolbar and the list content
 * (typically an `FzTable`). Designed to render inside a shell's main region, so
 * it does not force a viewport height or apply root safe-area insets (the shell
 * owns those). RFC §4 / Jira LIB-2694.
 */
type FzListTemplateProps = {
  /**
   * Where the `filters` rail sits relative to the content.
   * @default 'left'
   * @see FzListFiltersPosition
   */
  filtersPosition?: FzListFiltersPosition
  /**
   * Accessible name for the `filters` rail's `complementary` landmark (applied
   * as `aria-label` on the `<aside>`). Set it when the page exposes more than
   * one complementary region — e.g. when this template is nested inside a shell
   * that renders its own `aside` — so screen-reader users can distinguish the
   * filter rail from other complementary landmarks. Omit for a single,
   * unambiguous rail.
   */
  filtersLabel?: string
  /**
   * The element the main content region renders as. Defaults to `main` so the
   * list — the page's primary content — is a `main` landmark. Set to `div` when
   * the template is composed inside a shell that already renders a `<main>`
   * (e.g. `FzAppTemplate`'s default slot), to avoid nested `main` landmarks.
   * @default 'main'
   */
  mainAs?: 'main' | 'div'
}

/**
 * Slots for `FzListTemplate`.
 */
type FzListTemplateSlots = {
  /** Optional full-width region above the content (alerts, action cards, notices). */
  banner?(props: {}): any
  /** Optional filter rail (selects, filter widgets, a create action). */
  filters?(props: {}): any
  /** Optional toolbar above the list (title, search, actions). Not a landmark. */
  header?(props: {}): any
  /** The list content (typically an `FzTable` and its trailing modals). */
  default(props: {}): any
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
  FzListFiltersPosition,
  FzListTemplateProps,
  FzListTemplateSlots
}
