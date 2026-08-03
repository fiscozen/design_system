---
"@fiscozen/datepicker": patch
---

FzDatepicker: keep the calendar reachable when the system font scale grows the page, and make `autoPosition` do something

Two independent defects, both surfaced by a customer report of the calendar being cut off at the bottom of the screen with no way to scroll to it.

**The calendar had no height budget.** It was laid out at its intrinsic height wherever VueDatePicker placed it, so it could hang below the visible area unreachable: the menu does not scroll, and the surface behind it — usually a dialog body — does not scroll it into view either. Android WebViews honour the *system* font scale, so a user with larger text gets a taller form, a date field pushed further down, and no longer enough room beneath it for the calendar. Reproduced in the app's WebView at a 360x728 viewport with font scale 1.15: the field sits at 450..473, the calendar opens below it anyway and 50px of it falls outside the screen. At the largest accessibility font scales no placement fits at all, so an internal scroll is the only thing that keeps the calendar usable.

The menu now gets a `max-height` budgeted from the space actually available on the roomier side of the field — measured against `visualViewport`, so an open keyboard counts too — plus `overflow-y: auto`. The budget is recomputed on resize, scroll and visual-viewport changes while the calendar is open, and cleared when it closes. A CSS fallback of `calc(100dvh - 16px)` keeps the calendar inside the viewport even if the measurement never runs.

**`autoPosition` was dead API.** The prop is documented and defaults to `true`, but it was deleted on the way to VueDatePicker, which replaced it in v12 with the Floating UI middlewares `floating.flip` / `floating.shift`. Setting `autoPosition: false` therefore had no effect whatsoever. It is now translated into `flip: false` / `shift: false`, and an explicit `floating.flip` / `floating.shift` still wins so the finer-grained option stays authoritative.

Note: this does not change *where* the calendar is placed. A separate question — why the menu does not flip above the field even when there is room — is still open; the height budget makes the outcome non-blocking either way.
