# @fiscozen/layout

## 1.3.2

### Patch Changes

- 7677cb7: FzAppTemplate: collapse the content card to full-bleed on mobile and open the aside drawer full-screen

  Two mobile regressions surfaced by the frontoffice while consuming the template for its standard layout (LIB-2718). Both are cases where a shape that is correct on desktop was being applied unchanged below the `desktop` (1200px) breakpoint.

  **The content card framed the page in grey.** `chrome="card"` put a uniform 16px gutter on the main region and rounded the white content surface — a detached card floating in the page background. That is the desktop shape. On a phone the gutter spends horizontal space the content needs, and the rounded surface inside it reads as a framed box rather than as the page; the frontoffice had deliberately removed exactly this framing from its mobile dashboard, and consuming the template silently reinstated it.

  `card` now keeps its white surface below the breakpoint but goes full-bleed: no gutter on main, no rounding, and a uniform 16px padding in place of the 24px card padding — the content inset design asked for, 24px on large screens and 16px on small. The bottom bar drops its mirrored `px-16` at the same breakpoint — that inset exists only to keep the bar edge-aligned with the content card, so leaving it would break the very alignment invariant it enforces. `flat` is unchanged and stays full-bleed at every width.

  **The aside drawer was a 360px side sheet.** `w-[360px] max-w-[85vw]` is reasonable for a navigation or filter panel, but the aside's real content here is the support chat — tabs, a transcript and a composer with an upload control. In a 360px column capped at 85vw the composer is unusable, and the app cannot widen it: the width lives on the template's own class, not on anything the consumer passes through the slot.

  The drawer is now `inset-0 w-full`. A surface that covers the viewport has no visible edge, so `max-w-[85vw]` and `shadow-xl` are gone as well, and the drawer's directional safe-area padding gains the left inset it can now bleed under. The backdrop, dialog semantics, focus trap and Escape-to-close are untouched.

  Consumers that relied on either the mobile card frame or the partial side sheet will see a visual change below 1200px; there is no API change, and desktop rendering is identical.

## 1.3.1

### Patch Changes

- Updated dependencies [9a55c03]
  - @fiscozen/composables@1.1.3

## 1.3.0

### Minor Changes

- bb123e8: Add `layouts.json` — a machine-readable manifest of the package's page layouts

  The package now publishes, alongside the components, a declarative description of what each layout is _for_: its `kind` (`shell` / `page-content` / `bounded` / `region` / `grid`), its height contract, the page shape it covers, the layout it is most easily confused with, its slots and key props, which hosts it is verified to nest inside and the props required when nesting, the version it ships in, and whether every documented capability is reachable under a strict `compose-only` styling policy.

  This makes the layout choice answerable from the design system's own source of truth. Repos governed by the agentic-design plugin read the manifest at session start and generate a layout decision table, so a layout added here becomes selectable across the org with no per-repo configuration — replacing hand-copied layout lists that went stale on every release.

  Parity is enforced rather than reviewed: `layouts.manifest.spec.ts` asserts that every exported layout has an entry, that entries match their `Fz…Slots` types, that `nestWithin` names real shells, and that a declared compose-only gap is described — and it runs in the pre-commit `nx affected -t test:unit` gate. `layoutComposition.spec.ts` verifies the shell + page-content pairs the manifest advertises, including the negative case that documents why `mainAs="div"` is mandatory when nesting. A new `CLAUDE.md` states the contract for contributors, and `src/index.ts` carries a marker pointing at it.

  No component behaviour changes; no existing API is touched.

### Patch Changes

- Updated dependencies [00173e9]
- Updated dependencies [763fa7e]
  - @fiscozen/composables@1.1.2

## 1.2.0

### Minor Changes

- b3e69b8: Add `FzThreeColumnsTemplate` — the backoffice three-column workspace layout (header bar + collapsible list `sidebar` + two equal-width content columns, the left one a preview and the right one an independently scrollable body). Extracted from the app-internal `@fzp/shared` `FzLayoutThreeColumns` so the shape lives in the design system (LIB-2696 / epic RT-2054).

  Presentation-only and chrome-free: it owns the structural scaffold (flex regions, the collapsible sidebar's width animation + `v-model:sidebarCollapsed`, the independent-scroll regions, borders and the `aside`/`main` landmarks) and injects the back button, title, badge, filters and toggle control through slots (`sidebar-header` receives `{ collapsed, toggle }`). Fills the height of its bounded-height parent (documented height contract). The collapsible sidebar body uses `v-show` (not `v-if`) so scroll position and consumer-wired observers survive a collapse/expand cycle.

- d7cb02e: Add `FzSidebarTemplate` — the collapsible-sidebar application shell

  A new presentation-only page template (RFC §4, Jira LIB-2697 / epic RT-2054), extracted from the `it.fiscozen.people` app shell (`MainLayout` + `AppSidebar`) so the shape lives in the design system.

  It frames a template-owned colored sidebar in three vertical zones — `brand` (top), `nav` (scrollable middle, wrapped in a `<nav>` landmark) and `footer` (pinned bottom, e.g. the signed-in user + logout) — beside the page content (`FzLayoutMain`). From the `desktop` breakpoint (1200px) up the sidebar is a persistent sticky rail; below it, it collapses to an off-canvas drawer the template opens from a hamburger in a sticky mobile top bar — a focus-trapped `role="dialog"` with `aria-modal`, a click-to-dismiss backdrop and Escape-to-close. This is the mirror of `FzAppTemplate` (where the _aside_ collapses and the nav stays persistent); here the nav rail itself is what collapses.

  Presentation-only: it owns the responsive/collapse state and safe-area/sticky CSS but imports no store/router/API — only the `FzLayoutHeader`/`FzLayoutMain` region molecules and `FzIconButton` (the mobile hamburger; adds `@fiscozen/button` as a dependency). Colors are app-themed via `--fz-sidebar-bg` / `--fz-sidebar-text` (and `--fz-sidebar-width`, default 280px) — never baked in — and the nav items, their RBAC, routing, the brand, the user identity and logout all stay app-side, injected through the slots. Owns a full-height root (`min-h-dvh`).

### Patch Changes

- Updated dependencies [ea5c15c]
  - @fiscozen/composables@1.1.1

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
