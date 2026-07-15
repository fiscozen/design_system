---
"@fiscozen/layout": minor
---

layout page-templates extraction — `FzListTemplate` (backoffice list-page layout, LIB-2694).

Additive; no change to the existing `FzLayout` grid API or the other templates.

- `FzListTemplate`: the presentation-only backoffice list-page layout. Slots: `banner` (full-width, above), `filters` (a rail), `header` (a title/search/actions toolbar) and default (the list content, typically an `FzTable`). Props: `filtersPosition` (`left` | `top`, default `left`), `filtersLabel` (accessible name for the filters `complementary` landmark) and `mainAs` (`main` | `div`, default `main`). Composes the region molecules (`FzLayoutAside` + `FzLayoutMain`) with document scroll rather than wrapping `FzLayout leftShoulder` (which forces `100vh` mobile tracks and independent per-region scroll). Being a page-content template, it does not force a viewport height or apply root safe-area insets — set `mainAs="div"` when nesting it inside a shell that already renders a `<main>`.
