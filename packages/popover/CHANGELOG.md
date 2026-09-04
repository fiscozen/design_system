# @fiscozen/popover

## 0.2.0

### Minor Changes

- beabe52: New package: `FzPopover`, floating content that prefers the platform.

  Two engines behind one API. Where the browser has the Popover API, CSS anchor positioning and `position-area`, the content is a native `[popover]` in the top layer — never clipped by an ancestor's overflow, no z-index to arbitrate — placed entirely in CSS, so the browser keeps it glued to its anchor on scroll and resize with no JS, and light dismiss plus Esc come for free. Everywhere else, for `auto` placements, or on `forceFallback`, it delegates to `FzFloating` with `useClickOutside` / `useKeyDown` for dismissal.

  The API mirrors `FzFloating`'s vocabulary (the same 12 positions) so migrating a call site is a copy of the prop, and adds `v-model:open`, `offset`, `matchOpenerWidth` (`anchor-size()` in the CSS engine) and `anchor` for hanging the content off an element other than the opener.

  The fallback is meant to die: when CSS anchor positioning is everywhere, the second engine goes and `FzFloating` goes with it.

### Patch Changes

- beabe52: FzPopover: show a popover whose `open` is already true at mount. The watcher only fires on change, so a popover that starts open — a docs example, a visual snapshot, a menu restored from state — rendered closed while the model said open.
  - @fiscozen/composables@1.1.4
