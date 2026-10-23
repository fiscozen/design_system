---
'@fiscozen/composables': patch
---

FzFloating: react to a `position` that changes while the panel is open.

The engine's options were built with a copy of the prop, so the placement chosen at setup was the only one it ever resolved. A later change was observed — the watcher ran, `setPosition` rewrote the inline `top` — but the panel stayed exactly where it was, on the original side. Only callers that bind `position` to something reactive were affected (`FzTooltip` takes it as a prop, `FzSelect` and `FzTypeahead` pass a computed), so it failed silently rather than loudly.

Note that this changes behaviour for anyone who was living with it unknowingly: a `position` that oscillates will now actually move the panel.
