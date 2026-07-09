---
"@fiscozen/layout": minor
---

layout page-templates extraction — Phase 3 (DS: `FzAppTemplate` + bottom-bar region).

Additive; no change to the existing `FzLayout` grid API or the other templates.

- `FzAppTemplate`: the persistent-nav application shell (the frontoffice standard layout, RFC §4). Frames a persistent `nav`, an optional sticky `header`, the primary content, an optional complementary `aside`, an optional sticky bottom action bar and an optional `footer`. From the `desktop` breakpoint up the nav is a sticky left rail and the aside a sticky right panel (widths follow the injected content, never the template). The nav is persistent (a top region on mobile) — the injected nav (e.g. `FzNavbar`) owns its own responsive collapse + hamburger, so the template renders no nav drawer. Only the aside collapses below the breakpoint, into a modal drawer — `role="dialog"` + `aria-modal` + focus trap + Escape-to-close, opened via the `{ isDesktop, asideOpen, toggleAside }` slot props exposed on `nav`/`header`/`aside`. Props: `hasAside`, `hasBottomBar`, `chrome` (`card` | `flat`), `contentWidth` (`standard` | `wide` | `full`, replacing the app's dead `wideLayout` flag), `asideLabel`. Owns a full-height root and directional safe-area insets on its sticky chrome.
- `FzLayoutBottomBar`: the sticky bottom action-bar region molecule (built just-in-time for `FzAppTemplate`). `position: sticky` to the viewport bottom inside the main content column, so it aligns to that column via the layout engine — no rail-width knowledge — and reserves its own height (empty bar collapses; no manual bottom-padding). `pointer-events: none` container with interactive children; bottom safe-area inset.
- `FZ_BOTTOM_BAR_TARGET`: new exported injection key. `FzAppTemplate` `provide()`s its bottom-bar region element so deep page components can `<Teleport>` bar content to the shell without an app-owned DOM id (RFC §4 bottom-bar ADR — teleport-ownership + geometry decisions).
