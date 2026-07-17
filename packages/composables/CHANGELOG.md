# @fiscozen/composables

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
