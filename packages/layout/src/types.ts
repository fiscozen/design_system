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
 *   frontoffice standard-layout shape). The main region also carries a uniform
 *   16px grey gutter around the card, and the bottom bar mirrors the gutter's
 *   horizontal inset, so the content card and the bottom-bar card share the same
 *   left/right edges at every viewport width.
 * - `flat`: full-bleed content with no card frame and no gutter.
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
 * slots, so the app's injected chrome (a chat/support button, an aside close
 * control, …) can drive the collapsible `aside` without owning the responsive
 * state itself (RFC §4).
 *
 * Only the `aside` is here: the nav owns its own responsive/menu state (the
 * frontoffice nav is `FzNavbar`, which renders its own rail / mobile bar +
 * hamburger), so the template exposes no `navOpen`/`toggleNav`.
 */
type FzAppTemplateToggles = {
  /** `true` from the `desktop` breakpoint (1200px) up. */
  isDesktop: boolean
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
 * optional sticky bottom action bar, and an optional footer. The nav is placed
 * responsively (a left rail on desktop, a top region on mobile) but the injected
 * nav owns its own collapse/menu — the template renders no nav drawer. Only the
 * aside collapses: a right panel on desktop, a modal drawer below the `desktop`
 * breakpoint. Owns a full-height root, so it does not depend on app-global
 * `height`/`overflow` CSS (RFC §6.2).
 *
 * Presentation-only: it holds the aside's responsive/toggle state and
 * safe-area/sticky CSS but imports no store/router/API. Rail widths are a
 * function of the *injected* nav/aside content, never the template (RFC §4/§10).
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
   * Accessible name for the navigation landmark. The template wraps the `nav`
   * slot in a `<nav>` region so there is always a navigation landmark regardless
   * of what the injected nav renders as its own root; pass a label to
   * distinguish it for assistive tech (recommended when a page exposes more than
   * one navigation landmark). Omit for an unnamed — but still valid — landmark.
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
  /** Persistent navigation (left rail on desktop, top region on mobile), wrapped in a `<nav>` landmark; the injected nav owns its own collapse/menu. */
  nav?(props: FzAppTemplateToggles): any
  /** Optional sticky top bar (page title, actions, a chat/support toggle). */
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

/**
 * Props for `FzDetailTemplate` — the backoffice detail-page layout.
 *
 * A presentation-only page-content layout for record-detail pages: a persistent
 * `sidebar` summary/actions rail beside the detail body, plus an optional
 * full-width `banner` and an optional `toolbar` (title/actions). It is the list template's
 * sibling — where a list page pairs a *filter* rail with a table, a detail page
 * pairs a *summary/context* rail with the record's content (tabs, cards, forms).
 * Like `FzListTemplate` (LIB-2694) it is designed to render inside a shell's main
 * region, so it does not force a viewport height or apply root safe-area insets
 * (the shell owns those). RFC §4 / Jira LIB-2695.
 */
type FzDetailTemplateProps = {
  /**
   * Accessible name for the `sidebar`'s `complementary` landmark (applied as
   * `aria-label` on the `<aside>`). Set it when the page exposes more than one
   * complementary region — e.g. when this template is nested inside a shell that
   * renders its own `aside` — so screen-reader users can distinguish the record
   * summary from other complementary landmarks. Omit for a single, unambiguous
   * rail.
   */
  sidebarLabel?: string
  /**
   * The element the main content region renders as. Defaults to `main` so the
   * detail body — the page's primary content — is a `main` landmark. Set to
   * `div` when the template is composed inside a shell that already renders a
   * `<main>` (e.g. `FzAppTemplate`'s default slot), to avoid nested `main`
   * landmarks.
   * @default 'main'
   */
  mainAs?: 'main' | 'div'
}

/**
 * Slots for `FzDetailTemplate`.
 */
type FzDetailTemplateSlots = {
  /** Optional full-width region above the content (page-level alerts, notices). */
  banner?(props: {}): any
  /** The record summary/context rail (identity, status, meta, actions). */
  sidebar?(props: {}): any
  /**
   * Optional toolbar above the body (title, actions). A plain container, **not**
   * a `<header>`/banner landmark — the shell owns the page banner.
   */
  toolbar?(props: {}): any
  /** The detail body (typically `FzTabs`/`FzCard`s and its trailing modals). */
  default(props: {}): any
}

/**
 * The collapse state + toggle action `FzThreeColumnsTemplate` exposes to its
 * `sidebar-header` slot, so injected chrome (a title row, a collapse button) can
 * drive the collapsible sidebar without owning the collapse state. Mirrors
 * `FzAppTemplateToggles` (the aside toggle on `FzAppTemplate`).
 */
type FzThreeColumnsSidebarToggle = {
  /** Whether the sidebar is currently collapsed. */
  collapsed: boolean
  /** Collapse/expand the sidebar. Pass a boolean to force a state; omit to toggle. */
  toggle: (force?: boolean) => void
}

/**
 * Props for `FzThreeColumnsTemplate` — the backoffice three-column workspace
 * layout. The full narrative (structure, height contract, landmarks) lives on the
 * component. `sidebarCollapsed` is a `v-model` (declared on the component via
 * `defineModel`), not a plain prop, so it is not listed here.
 */
type FzThreeColumnsTemplateProps = {
  /**
   * The element the content-columns region renders as. Defaults to `main` so the
   * two columns — the page's primary content — are a `main` landmark. Set to
   * `div` when composed inside a shell that already renders a `<main>`, to avoid
   * nested `main` landmarks.
   * @default 'main'
   */
  mainAs?: 'main' | 'div'
  /**
   * Accessible name for the `sidebar`'s `complementary` landmark (applied as
   * `aria-label` on the `<aside>`). Set it when the page exposes more than one
   * complementary region so screen-reader users can tell them apart.
   */
  sidebarLabel?: string
}

/**
 * Slots for `FzThreeColumnsTemplate`. The `sidebar-header` slot receives the
 * collapse toggle props (`FzThreeColumnsSidebarToggle`); the template is
 * otherwise chrome-free — back button, title, badge, filter widgets and the
 * toggle control are all injected through these slots.
 */
type FzThreeColumnsTemplateSlots = {
  /** Left side of the header bar (e.g. back button + title + badge). */
  'header-left'?(props: {}): any
  /** Right side of the header bar (e.g. action buttons). */
  'header-right'?(props: {}): any
  /**
   * The sidebar's top row (e.g. a title + the collapse/expand control). Receives
   * `{ collapsed, toggle }`. Stays visible when the sidebar is collapsed.
   */
  'sidebar-header'?(props: FzThreeColumnsSidebarToggle): any
  /** Filter controls below the sidebar title row. Hidden (via `v-show`) when collapsed. */
  'sidebar-filter'?(props: {}): any
  /** Scrollable sidebar body (e.g. the list). Hidden (via `v-show`) when collapsed. */
  'sidebar-content'?(props: {}): any
  /** Left content column (e.g. a document preview). */
  'column-left'?(props: {}): any
  /** Header row of the right content column. */
  'column-right-header'?(props: {}): any
  /** Scrollable body of the right content column (the primary working area). */
  'column-right-content'?(props: {}): any
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
  FzAppTemplateSlots,
  FzListFiltersPosition,
  FzListTemplateProps,
  FzListTemplateSlots,
  FzDetailTemplateProps,
  FzDetailTemplateSlots,
  FzThreeColumnsSidebarToggle,
  FzThreeColumnsTemplateProps,
  FzThreeColumnsTemplateSlots
}
