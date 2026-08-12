---
"@fiscozen/layout": patch
---

FzAppTemplate: pin the mobile nav bar, which could not be pinned from the injected nav

The nav is persistent at both sizes, but only the desktop rail was actually pinned: `nav--rail` carried `sticky top-0`, `nav--bar` carried nothing, so on mobile the bar scrolled away with the page.

The frontoffice had already tried to fix this from its side, putting `sticky top-0 z-10` on the injected nav's own root — with a comment noting the template's mobile nav region is not sticky by default. That could never work, and the reason is worth recording because it is easy to repeat: `position: sticky` is bounded by its containing block, and the nav region is a `shrink-0` item in a column flex root, so it is exactly as tall as the nav inside it. A sticky child of a box that fits it has zero travel — the declaration applies and does nothing, then scrolls off with its parent. The bar looked correct in every static screenshot and only failed once someone scrolled.

`nav--bar` now carries `sticky top-0 z-10` itself, where it has the whole root to travel against. `z-10` matches the sticky header and stays below the aside backdrop (`z-20`) and drawer (`z-30`), so the full-screen chat still covers the bar.

Consumers that added their own sticky positioning to the injected nav to compensate can drop it — it was inert.
