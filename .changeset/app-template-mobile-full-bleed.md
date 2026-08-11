---
"@fiscozen/layout": patch
---

FzAppTemplate: collapse the content card to full-bleed on mobile and open the aside drawer full-screen

Two mobile regressions surfaced by the frontoffice while consuming the template for its standard layout (LIB-2718). Both are cases where a shape that is correct on desktop was being applied unchanged below the `desktop` (1200px) breakpoint.

**The content card framed the page in grey.** `chrome="card"` put a uniform 16px gutter on the main region and rounded the white content surface — a detached card floating in the page background. That is the desktop shape. On a phone the gutter spends horizontal space the content needs, and the rounded surface inside it reads as a framed box rather than as the page; the frontoffice had deliberately removed exactly this framing from its mobile dashboard, and consuming the template silently reinstated it.

`card` now keeps its white surface below the breakpoint but goes full-bleed: no gutter on main, no rounding, and a uniform 16px padding in place of the 24px card padding — the content inset design asked for, 24px on large screens and 16px on small. The bottom bar drops its mirrored `px-16` at the same breakpoint — that inset exists only to keep the bar edge-aligned with the content card, so leaving it would break the very alignment invariant it enforces. `flat` is unchanged and stays full-bleed at every width.

**The aside drawer was a 360px side sheet.** `w-[360px] max-w-[85vw]` is reasonable for a navigation or filter panel, but the aside's real content here is the support chat — tabs, a transcript and a composer with an upload control. In a 360px column capped at 85vw the composer is unusable, and the app cannot widen it: the width lives on the template's own class, not on anything the consumer passes through the slot.

The drawer is now `inset-0 w-full`. A surface that covers the viewport has no visible edge, so `max-w-[85vw]` and `shadow-xl` are gone as well, and the drawer's directional safe-area padding gains the left inset it can now bleed under. The backdrop, dialog semantics, focus trap and Escape-to-close are untouched.

Consumers that relied on either the mobile card frame or the partial side sheet will see a visual change below 1200px; there is no API change, and desktop rendering is identical.
