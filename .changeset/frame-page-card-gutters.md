---
"@fiscozen/layout": patch
---

`FzFrameTemplate` aligns the page card with the chrome, and one gutter separates it from
the tools panel (LIB-3054).

The content region inset the page card by 8px on all four sides. On the top and left edges
that inset separated the card from nothing: the toolbar sits flush above the region and
the nav rail flush beside it, so the gutter read as the card being off by 8px from chrome
it is meant to line up with. And because the region's right gutter and the aside's left
gutter both applied, the space between the two cards was 16px while the space between the
aside and the window was 8px.

- **The content region drops its top gutter, and its left gutter from `lg` up.** Below the
  breakpoint the nav is a bar across the top and the region's left edge is the window's, so
  the gutter stays there.
- **The aside drops its left gutter.** The gap between the two cards is now the content
  region's gutter alone, equal to the aside's own margin to the window edge.

The right and bottom gutters, and every safe-area inset, are unchanged. The story test for
the shell now measures the four edges in a real browser, so the contract fails loudly
rather than drifting.
