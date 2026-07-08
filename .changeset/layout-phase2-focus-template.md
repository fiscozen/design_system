---
"@fiscozen/layout": minor
---

layout page-templates extraction — Phase 2 (DS: `FzFocusTemplate` + flow regions).

Additive; no change to the existing `FzLayout` grid API.

- `FzLayoutHeader` / `FzLayoutAside` / `FzLayoutFooter`: three thin region molecules that render their semantic landmark (`<header>`/`<aside>`/`<footer>`, each `as`-overridable) and a stable class hook. Built just-in-time for `FzFocusTemplate`; layout-specific sizing/padding is applied by the composing template.
- `FzFocusTemplate`: the distraction-reduced flow template (onboarding + auth). Optional `topbar`, `aside` and `footer` regions frame a centered main region; `chrome` (`card` | `flat`, default `card`) makes the content frame explicit — `flat` turns today's implicit "auth" branch into a variant. Owns a full-height root (`min-h-dvh`) and applies device safe-area insets, so it does not depend on app-global `height`/`overflow` CSS.
