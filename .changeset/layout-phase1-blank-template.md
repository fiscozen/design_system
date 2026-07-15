---
"@fiscozen/layout": minor
---

layout page-templates extraction — Phase 1 (`FzBlankTemplate` + first region).

Additive; no change to the existing `FzLayout` grid API.

- `FzLayoutMain`: the first region molecule — a presentation-only wrapper that renders a semantic `<main>` landmark (`as` overridable) and owns content alignment (`align`: `stretch` | `top` | `center`) and device safe-area insets (`safeArea`). Built just-in-time for its first template consumer.
- `FzBlankTemplate`: the full-bleed, no-chrome page template (single full-height content region, `align`: `center` | `top`). For auth/login screens and standalone tools. Owns a full-height root (`min-h-dvh`), so it does not depend on app-global `height`/`overflow` CSS.
