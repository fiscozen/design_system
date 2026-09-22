---
'@fiscozen/layout': patch
---

fix(layout): LIB-2718 let the drawer enter, and drop the content cap below the breakpoint

Two findings from the frontoffice design review of `FzAppTemplate`.

The mobile aside appeared between two frames. It is opaque and covers the whole
viewport, so with no motion the page is simply gone and the user has to re-read
the screen to work out what happened — the shell it replaced animated it in from
the right. The drawer now enters from the edge it is docked to, in 300ms, and
only where the user has not asked for reduced motion. Entry only: closing is a
tap on a control already under their eye, and an exit animation delays the page
they asked to get back to.

The content card kept its `contentWidth` cap at every viewport, while the nav
region is full-width at both. Below the `desktop` breakpoint the card is
supposed to be full-bleed — no gutter, no rounding — but from the 1024px cap up
to the 1200px breakpoint the cap is narrower than the column, so the card was
centred in a grey gutter with square corners beside a nav bar running edge to
edge. The cap is the card's reading measure, so it is now scoped to the card's
desktop shape and the mobile shape is full-bleed as documented.
