---
"@fiscozen/datepicker": patch
---

FzDatepicker: stop the arrow from disabling auto-positioning, so the calendar can open above the field

The calendar stayed anchored below its field even with no room below it, running off the bottom of the screen with no way to reach it. Reported as a calendar bigger than the screen in the mobile app; measured in production at a 320x640 viewport with the field at 465..537 and a 324px calendar opening at 547..871 — 231px past the bottom edge, with 497px sitting free above and ignored.

`flip` was being handed that overflow and doing nothing with it. The chain, confirmed by instrumenting the middleware in the live page:

- VueDatePicker builds its middleware as `[offset, arrow, flip, shift]` — `arrow` _before_ `flip`, the reverse of Floating UI's documented order — with the arrow enabled by default.
- On an aligned placement the arrow renders with neither `dp__arrow_top` nor `dp__arrow_bottom`, because the class binding compares the whole placement against `"bottom"` / `"top"` instead of just the side. An unstyled arrow is a full-width, zero-height block.
- `arrow()` therefore measures an arrow wider than the reference (320 against 312), concludes it points at nothing, and returns an `alignmentOffset` of -3 with a reset.
- `flip` opens with `if (middlewareData.arrow?.alignmentOffset) return {}`, so from the first render onwards it bails on every recompute. It was logged receiving `overflow.bottom: 231` and returning `{}`.

Because `alignmentOffset` only exists for aligned placements, this hit every consumer passing `bottom-start` / `bottom-end` and never showed up under the default bare `bottom` — which is why it was invisible in Storybook.

`floating.arrow` now defaults to `false`. The arrow slot is gated on `floating.arrow === true`, so the element is no longer created and the full chain runs again: `bottom-start` (231 overflow) → `bottom-end` (231) → `top-start` (no overflow), calendar fully visible. `shift` also starts correcting horizontal overflow again. A consumer that wants an arrow can still pass `floating.arrow` explicitly and gets the previous behaviour, suppressed flip included.

Nothing changes visually: the arrow was already hidden via `.dp__arrow_top`, so it was contributing only the loss of auto-placement. That CSS rule is now dead for the default configuration and kept only for consumers that opt the arrow back in.

Note for consumers: `mappedProps.floating` is now always defined (it carries at least `arrow: false`), where before it was `undefined` when neither `floating` nor `placement` was set. The height budget shipped earlier is unaffected and remains the fallback for when neither side of the field has room — at large system font scales an internal scroll is still the only thing that keeps the calendar usable.
