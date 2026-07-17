# @fiscozen/layout

## 1.1.0

### Minor Changes

- 91d8f88: layout page-templates extraction — `FzDetailTemplate` (backoffice detail-page layout, LIB-2695).

  Additive; no change to the existing `FzLayout` grid API or the other templates.
  - `FzDetailTemplate`: the presentation-only backoffice detail-page layout and the sibling of `FzListTemplate` — where a list page pairs a _filter_ rail with a table, a detail page pairs a persistent `sidebar` summary/context rail (identity, status, meta, actions) with the record's content. Slots: `banner` (full-width, above), `sidebar` (the summary rail, a `complementary` landmark), `toolbar` (a title/actions bar, deliberately not a `<header>`/banner landmark) and default (the detail body, typically `FzTabs`/`FzCard`s). Props: `sidebarLabel` (accessible name for the sidebar `complementary` landmark) and `mainAs` (`main` | `div`, default `main`). Composes the region molecules (`FzLayoutAside` + `FzLayoutMain`) with document scroll rather than wrapping `FzLayout leftShoulder` (which forces `100vh` mobile tracks and independent per-region scroll). Being a page-content template, it does not force a viewport height or apply root safe-area insets — set `mainAs="div"` when nesting it inside a shell that already renders a `<main>`.

- 1e67bc7: layout page-templates extraction — `FzListTemplate` (backoffice list-page layout, LIB-2694).

  Additive; no change to the existing `FzLayout` grid API or the other templates.
  - `FzListTemplate`: the presentation-only backoffice list-page layout. Slots: `banner` (full-width, above), `filters` (a rail), `header` (a title/search/actions toolbar) and default (the list content, typically an `FzTable`). Props: `filtersPosition` (`left` | `top`, default `left`), `filtersLabel` (accessible name for the filters `complementary` landmark) and `mainAs` (`main` | `div`, default `main`). Composes the region molecules (`FzLayoutAside` + `FzLayoutMain`) with document scroll rather than wrapping `FzLayout leftShoulder` (which forces `100vh` mobile tracks and independent per-region scroll). Being a page-content template, it does not force a viewport height or apply root safe-area insets — set `mainAs="div"` when nesting it inside a shell that already renders a `<main>`.

- 1c2baef: layout page-templates extraction — Phase 0 (breakpoint groundwork).
  - `@fiscozen/composables`: `useBreakpoints()` gains a reactive `current()` accessor that returns the name of the largest breakpoint whose `min-width` is currently matched (descending priority, inclusive `min-width` for boundary-parity with a `>=` check; order-independent).
  - `@fiscozen/layout`: `FzLayout` now resolves its active breakpoint through `useBreakpoints().current()` instead of a bespoke `window.resize` listener, and gains an opt-out `disablePadding` prop. Padding stays on by default (`p-12`), so existing consumers render identically.

- 00000dd: layout page-templates extraction — Phase 1 (`FzBlankTemplate` + first region).

  Additive; no change to the existing `FzLayout` grid API.
  - `FzLayoutMain`: the first region molecule — a presentation-only wrapper that renders a semantic `<main>` landmark (`as` overridable) and owns content alignment (`align`: `stretch` | `top` | `center`) and device safe-area insets (`safeArea`). Built just-in-time for its first template consumer.
  - `FzBlankTemplate`: the full-bleed, no-chrome page template (single full-height content region, `align`: `center` | `top`). For auth/login screens and standalone tools. Owns a full-height root (`min-h-dvh`), so it does not depend on app-global `height`/`overflow` CSS.

- 00000dd: layout page-templates extraction — Phase 2 (DS: `FzFocusTemplate` + flow regions).

  Additive; no change to the existing `FzLayout` grid API.
  - `FzLayoutHeader` / `FzLayoutAside` / `FzLayoutFooter`: three thin region molecules that render their semantic landmark (`<header>`/`<aside>`/`<footer>`, each `as`-overridable) and a stable class hook. Built just-in-time for `FzFocusTemplate`; layout-specific sizing/padding is applied by the composing template.
  - `FzFocusTemplate`: the distraction-reduced flow template (onboarding + auth). Optional `topbar`, `aside` and `footer` regions frame a centered main region; `chrome` (`card` | `flat`, default `card`) makes the content frame explicit — `flat` turns today's implicit "auth" branch into a variant. Owns a full-height root (`min-h-dvh`) and applies device safe-area insets, so it does not depend on app-global `height`/`overflow` CSS.

- 40c2135: layout page-templates extraction — Phase 3 (DS: `FzAppTemplate` + bottom-bar region).

  Additive; no change to the existing `FzLayout` grid API or the other templates.
  - `FzAppTemplate`: the persistent-nav application shell (the frontoffice standard layout, RFC §4). Frames a persistent `nav`, an optional sticky `header`, the primary content, an optional complementary `aside`, an optional sticky bottom action bar and an optional `footer`. From the `desktop` breakpoint up the nav is a sticky left rail and the aside a sticky right panel (widths follow the injected content, never the template). The nav is persistent (a top region on mobile) — the injected nav (e.g. `FzNavbar`) owns its own responsive collapse + hamburger, so the template renders no nav drawer. Only the aside collapses below the breakpoint, into a modal drawer — `role="dialog"` + `aria-modal` + focus trap + Escape-to-close, opened via the `{ isDesktop, asideOpen, toggleAside }` slot props exposed on `nav`/`header`/`aside`. The `nav` slot is wrapped in a `<nav>` landmark, named via the optional `navLabel` prop, so there is always a navigation landmark regardless of the injected nav's own root element. In `card` chrome the main region carries a uniform 16px grey gutter around the content card, and the bottom bar mirrors that horizontal inset, so the content card and the bottom-bar card share the same left/right edges at every viewport width. Props: `hasAside`, `hasBottomBar`, `chrome` (`card` | `flat`), `contentWidth` (`standard` | `wide` | `full`, replacing the app's dead `wideLayout` flag), `navLabel`, `asideLabel`. Owns a full-height root and directional safe-area insets on its sticky chrome.
  - `FzLayoutBottomBar`: the sticky bottom action-bar region molecule (built just-in-time for `FzAppTemplate`). `position: sticky` to the viewport bottom inside the main content column, so it aligns to that column via the layout engine — no rail-width knowledge — and reserves its own height (empty bar collapses; no manual bottom-padding). `pointer-events: none` container with interactive children; bottom safe-area inset.
  - `FZ_BOTTOM_BAR_TARGET`: new exported injection key. `FzAppTemplate` `provide()`s its bottom-bar region element so deep page components can `<Teleport>` bar content to the shell without an app-owned DOM id (RFC §4 bottom-bar ADR — teleport-ownership + geometry decisions).

### Patch Changes

- Updated dependencies [1c2baef]
- Updated dependencies [1c2baef]
  - @fiscozen/composables@1.1.0
  - @fiscozen/style@0.4.0

## 1.0.1

### Patch Changes

- Updated dependencies [a243ebb]
  - @fiscozen/composables@1.0.4

## 1.0.0

### Major Changes

- ee8232a: Add `threeColumns` layout variant and `hasBottomBar` prop.

  The new `threeColumns` variant implements the frontoffice three-column pattern: a collapsible `menuBar` (256px, collapses to a top bar on mobile), a `header` and `main` center column, and a `chat` right panel (320px, hidden on mobile). The `hasBottomBar` prop adds a full-width `footer` row at the bottom of the grid.

## 0.1.6

### Patch Changes

- Updated dependencies [34a7934]
  - @fiscozen/composables@1.0.3

## 0.1.5

### Patch Changes

- Updated dependencies [a26bc2c]
  - @fiscozen/style@0.3.0
  - @fiscozen/composables@1.0.2

## 0.1.4

### Patch Changes

#### Modifiche dalla versione 0.1.3

- Rinominata la proprietà `isViewport` per maggiore chiarezza
- Correzione dell'altezza quando la modalità viewport è disabilitata
- Correzione della larghezza quando non utilizzato in modalità viewport
- Aggiornamento al layout a due colonne (LIB-1580)
- Updated dependencies
  - @fiscozen/style@0.2.0
  - @fiscozen/composables@1.0.1
