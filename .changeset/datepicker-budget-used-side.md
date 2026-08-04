---
"@fiscozen/datepicker": patch
---

FzDatepicker: budget the calendar's height against the side it is actually placed on

The height cap added in 3.2.10 budgeted the roomier side above or below the field, assuming VueDatePicker would place the calendar there. It does not always: when it picks the tighter side the cap is far too generous to ever bind, so the calendar is cut off exactly as it was before the cap existed.

Measured on a 320x620 viewport with the field at `504..524` — 504px above it, 96px below — VueDatePicker placed the calendar below anyway. The budget came out 496px (the space above) against 88px of real space, so `max-height` never constrained anything, `overflow-y: auto` produced no scroll, and 250px of calendar hung off the bottom with not a single date cell reachable.

The budget is now taken from the side the menu actually occupies, determined by comparing the menu's box with the field's. Since the menu is not in the DOM on the first pass, the budget is recomputed once VueDatePicker has rendered it, and a `ResizeObserver` on the menu keeps it correct when the calendar changes height (switching to the month or year view). Only a menu with a real box is considered, so a zero-size one — mid-transition, or belonging to another picker — cannot mislead the side detection.

Still open, and deliberately not addressed here: why `flip` does not move the calendar to the side with more room. Forcing a Floating UI recompute while the menu is open leaves the position unchanged, so it is not a stale measurement. The lever for whoever takes it on is that VueDatePicker builds its middleware as `flip(typeof floating.flip === 'object' ? floating.flip : {})`, so Floating UI options can be passed through FzDatepicker's `floating.flip` prop. This change makes the outcome usable regardless of the answer.
