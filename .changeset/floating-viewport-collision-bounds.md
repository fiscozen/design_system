---
"@fiscozen/composables": patch
---

useFloating: stop `document.body`'s box from collapsing the collision bounds

Collision handling intersected the container's rect with the viewport. The container defaults to `document.body` — both in `useFloating`'s own fallback and in `FzFloating`, which always passes `props.container || document.body` — and body's box describes how the page happens to lay itself out rather than anything a floating element should be clipped to.

On an app shell that gives body a fixed height and scrolls an inner element, body's rect leaves the viewport as soon as the page is scrolled, and the intersection collapses. Measured on a frontoffice invoice list with a 411px-tall viewport scrolled by 260px: body's rect was `top -260 / bottom 151`, so the usable area came out as 151px instead of 411px, and available height as 135px instead of 395px. A 348px menu was then left anchored to its opener and hanging 293px below the fold. Before the opener-aware vertical correction, the same bounds pinned it to the 8px top margin instead — the "action list opens at the top of the page" symptom.

When the resolved container is `document.body`, the viewport alone is now used as the collision boundary. A container the consumer actually named still constrains the correction exactly as before, so a genuinely narrower container is still honoured. Body's rect continues to be used for everything else it feeds: openerless positioning relative to the container, the intersection observer, and the `containerRect` handed to the position callback.

One behavioural note for consumers: passing `document.body` explicitly as the container now yields viewport bounds rather than body's box. That is the intended reading — body means "no container" — and no known consumer relies on the old behaviour.
