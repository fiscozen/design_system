# @fiscozen/composables

## 1.2.0

### Minor Changes

- 4fa961d: FzFloating: make a flipped panel's gap and gap class follow the side it actually landed on

  The opener-aware vertical correction shipped in 1.1.2 moves a panel to the other side of its opener when it does not fit. What it did not move was the spacing: the gap class is derived from the resolved position, so a `top` panel flipped below its opener kept `mb-4`, leaving the margin on the edge facing away from the opener.

  That class is load-bearing, not decorative. The position calculators take the gap from the element's own margin — `bottom*` leaves `y` on the opener's edge and lets `margin-top` shift the fixed element down, `top*` subtracts `margin-bottom` outright — while the correction spaced a flipped panel by `VIEWPORT_MARGIN` instead. So a flipped panel sat 8px from its opener where a natively-placed one on that side sits 16px, and carried a margin that did nothing on a fixed element positioned by `top`.

  Both halves now come from the same place:
  - the flip is spaced by the gap declared in the panel's vertical margin class, so a flipped panel is spaced exactly like a native one on that side — above the opener the gap is in the arithmetic, below it `y` sits on the opener's edge and the flipped side's `margin-top` supplies it;
  - the correction reports the side it landed on, and the resolved position is mirrored onto it (keeping the alignment: `top-start` becomes `bottom-start`), so the gap class follows.

  Only `top*` / `bottom*` placements are affected. `left*` / `right*` sit beside their opener and keep their horizontal gap, so a vertical correction no longer restyles them onto a vertical side.

  Notes for consumers. The resolved position (`actualPosition`) now reports the flipped side, which is the intended reading — a flipped panel _is_ a panel on that side — but code that compared it against the requested `position` prop to detect "no flip happened" will see them differ. `FzSelect` and `FzTypeahead` derive the panel's max-height from it, so a panel requested below that flips above its opener is now capped by the space above it instead of the space below. And a panel whose gap class has been overridden away now touches its opener when it flips, exactly as it already did when placed natively on that side; the flip no longer supplies a gap of its own.

### Patch Changes

- 4fa961d: FzFloating: react to a `position` that changes while the panel is open.

  The engine's options were built with a copy of the prop, so the placement chosen at setup was the only one it ever resolved. A later change was observed — the watcher ran, `setPosition` rewrote the inline `top` — but the panel stayed exactly where it was, on the original side. Only callers that bind `position` to something reactive were affected (`FzTooltip` takes it as a prop, `FzSelect` and `FzTypeahead` pass a computed), so it failed silently rather than loudly.

  Note that this changes behaviour for anyone who was living with it unknowingly: a `position` that oscillates will now actually move the panel.

## 1.1.6

### Patch Changes

- 65d8e36: `FzFloating` applies its `openerClass` prop to the element wrapping the opener. The prop was declared but never rendered.

## 1.1.5

### Patch Changes

- fbf556a: `useFloating` stops spending the content's margin twice on the `right` positions (LIB-3055).

  `right`, `right-start` and `right-end` anchored the content at `opener.right + margins.left`.
  That value is written to `style.left` of an element that keeps its own `margin-left`, and for
  a positioned box with `left` set and `right: auto` the margin already moves the border edge
  past it — so the margin applied twice and the gap came out double.

  The other nine positions never did this: they subtract the margin on the _alignment_ axis,
  which is what cancels the layout margin, and leave the _offset_ axis to the CSS margin alone.
  The right family now follows the same rule and anchors at `opener.right`.

  Every right-positioned floating moves closer to its opener by its own margin. With the
  default `ml-4` that is 4px; a consumer that asks for a wider gap gets the gap it asked for
  instead of twice it.

  The position tests only asserted that the coordinates were numbers, so nothing could have
  caught this. They now assert the exact anchor for each of the three.

## 1.1.4

### Patch Changes

- Updated dependencies [f11859d]
  - @fiscozen/style@0.5.0

## 1.1.3

### Patch Changes

- 9a55c03: useFloating: stop `document.body`'s box from collapsing the collision bounds

  Collision handling intersected the container's rect with the viewport. The container defaults to `document.body` — both in `useFloating`'s own fallback and in `FzFloating`, which always passes `props.container || document.body` — and body's box describes how the page happens to lay itself out rather than anything a floating element should be clipped to.

  On an app shell that gives body a fixed height and scrolls an inner element, body's rect leaves the viewport as soon as the page is scrolled, and the intersection collapses. Measured on a frontoffice invoice list with a 411px-tall viewport scrolled by 260px: body's rect was `top -260 / bottom 151`, so the usable area came out as 151px instead of 411px, and available height as 135px instead of 395px. A 348px menu was then left anchored to its opener and hanging 293px below the fold. Before the opener-aware vertical correction, the same bounds pinned it to the 8px top margin instead — the "action list opens at the top of the page" symptom.

  When the resolved container is `document.body`, the viewport alone is now used as the collision boundary. A container the consumer actually named still constrains the correction exactly as before, so a genuinely narrower container is still honoured. Body's rect continues to be used for everything else it feeds: openerless positioning relative to the container, the intersection observer, and the `containerRect` handed to the position callback.

  One behavioural note for consumers: passing `document.body` explicitly as the container now yields viewport bounds rather than body's box. That is the intended reading — body means "no container" — and no known consumer relies on the old behaviour.

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
