# @fiscozen/composables

## 1.1.2

### Patch Changes

- 00173e9: FzFloating: stop the vertical viewport correction from detaching the panel from its opener

  The boundary correction added in 1.1.1 shifted a floating panel up whenever it would overflow the bottom of the viewport. That is the wrong move for a panel anchored to an opener, and it produced two visible defects — reported as action lists opening at the top of the page instead of next to their button:
  - a panel slightly too tall was slid up **across its own opener**, covering the control that opened it;
  - a panel taller than the viewport was pinned to the 8px top margin, i.e. arbitrarily far from its opener — 760px away at a 412x792 viewport with the opener near the bottom.

  It bites hardest on placements that never flip: `FzDropdown` resolves its `align` prop to an explicit `bottom` / `bottom-start` / `bottom-end` position, and auto-position resolution only runs for `auto*` placements, so this correction is the only vertical adjustment a dropdown ever receives.

  The vertical correction is now opener-aware:
  - if the panel would overflow the bottom and fits on the other side of the opener, it **flips above** it (and the mirror case for `top*` placements overflowing the top);
  - if it fits nowhere else but fits in the viewport, it is clamped as before;
  - if it is taller than the available space, the anchored position is kept — clamping cannot reveal more of it and only breaks the association with the opener.

  The horizontal correction is deliberately unchanged: a panel shifted sideways stays on the opener's row and still reads as belonging to it, and clamping a too-wide panel to the left margin does bring its content on screen. Neither of those holds vertically.

  Note for consumers: a panel taller than the visible space is now cropped at the bottom instead of being moved to the top of the screen. Capping the panel height with internal scrolling is tracked separately.

- 763fa7e: FzFloating: stop pinning the panel to a narrow opener below the `xs` breakpoint

  On viewports at or below the `xs` breakpoint (376px) `FzFloating` forced the floating panel's width to the opener's width, so the panel would cover its opener — the intent behind the `FzTab` mobile picker and select-like inputs, whose openers span the available width.

  For a narrow opener the same rule broke the panel: a 44px icon button (`FzIconDropdown`, e.g. a per-row kebab menu) collapsed the panel box to 44px while its action list kept painting at its intrinsic width, outside the box. The viewport clamp added in 1.1.1 could not correct this — it measures the panel box, which at 44px was already comfortably on screen — so on a 360px-wide device the menu rendered roughly 190px off the right edge, half visible.

  The rule is now expressed as a minimum instead of a fixed width: `width` stays `auto` and `min-width` is set to the opener's width on `xs`. Full-width openers still get a panel that covers them, while a narrow opener's panel takes its content width, at which point the existing boundary correction keeps it inside the viewport. Above `xs` nothing changes.

## 1.1.1

### Patch Changes

- ea5c15c: FzFloating: keep floating content inside the viewport horizontally and vertically

  `useFloating`'s boundary correction previously clamped the floating element to the resolved container rect only. For openerless / container-less consumers (e.g. `FzDropdown`) the container resolves to `document.body`, whose rect can be wider than — or extend below — the visible viewport on narrow/mobile screens. A dropdown opened from a control near the right edge (such as a per-row kebab menu in a table) could therefore render overflowing off the right edge or overlapping adjacent menus.

  Boundary correction now clamps against the intersection of the container and the viewport (`window.innerWidth`/`innerHeight`, mirroring the auto-positioning util) and keeps an 8px safety margin: if the element would overflow the right edge it is shifted left so its right edge stays on screen, the left edge is clamped to the margin, and the same is applied vertically. Behaviour is unchanged when there is enough room.

## 1.1.0

### Minor Changes

- 1c2baef: layout page-templates extraction — Phase 0 (breakpoint groundwork).
  - `@fiscozen/composables`: `useBreakpoints()` gains a reactive `current()` accessor that returns the name of the largest breakpoint whose `min-width` is currently matched (descending priority, inclusive `min-width` for boundary-parity with a `>=` check; order-independent).
  - `@fiscozen/layout`: `FzLayout` now resolves its active breakpoint through `useBreakpoints().current()` instead of a bespoke `window.resize` listener, and gains an opt-out `disablePadding` prop. Padding stays on by default (`p-12`), so existing consumers render identically.

### Patch Changes

- Updated dependencies [1c2baef]
  - @fiscozen/style@0.4.0

## 1.0.4

### Patch Changes

- a243ebb: Fix mobile dropdown menu issues: tapping the icon dropdown trigger again now closes the menu (it previously only ever re-opened it), and the floating menu no longer jumps to the top-left corner when its opener becomes hidden (e.g. an accordion collapses while the menu is still open).

## 1.0.3

### Patch Changes

- 34a7934: Fix decimal precision (IEEE 754 floating-point drift)

## 1.0.2

### Patch Changes

- Updated dependencies [a26bc2c]
  - @fiscozen/style@0.3.0
