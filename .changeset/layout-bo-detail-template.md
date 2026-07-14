---
"@fiscozen/layout": minor
---

layout page-templates extraction — `FzDetailTemplate` (backoffice detail-page layout, LIB-2695).

Additive; no change to the existing `FzLayout` grid API or the other templates.

- `FzDetailTemplate`: the presentation-only backoffice detail-page layout and the sibling of `FzListTemplate` — where a list page pairs a _filter_ rail with a table, a detail page pairs a persistent `sidebar` summary/context rail (identity, status, meta, actions) with the record's content. Slots: `banner` (full-width, above), `sidebar` (the summary rail, a `complementary` landmark), `header` (a title/actions toolbar) and default (the detail body, typically `FzTabs`/`FzCard`s). Props: `sidebarLabel` (accessible name for the sidebar `complementary` landmark) and `mainAs` (`main` | `div`, default `main`). Composes the region molecules (`FzLayoutAside` + `FzLayoutMain`) with document scroll rather than wrapping `FzLayout leftShoulder` (which forces `100vh` mobile tracks and independent per-region scroll). Being a page-content template, it does not force a viewport height or apply root safe-area insets — set `mainAs="div"` when nesting it inside a shell that already renders a `<main>`.
