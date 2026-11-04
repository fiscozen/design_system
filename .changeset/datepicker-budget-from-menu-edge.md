---
"@fiscozen/datepicker": patch
---

FzDatepicker: measure the calendar's height budget from the menu's edge, not the field's

The budget introduced for large system font scales was measured from the bottom (or top) of the _field_, but VueDatePicker separates field and menu by its own `offset`, plus arrow and padding. That gap was handed back as if it were usable space, so whenever the budget bound, the calendar overflowed by exactly `gap - margin`.

Measured on a 360x640 viewport with the field at 505..525 and the menu opening at 547: a 107px budget (`640 - 525 - 8`) against 85px of real space, cutting the calendar off by 14px — deterministically the 22px gap minus the 8px margin. Confirmed against the shipped bundle with a DevTools override before writing the fix: measuring from the menu edge gives 85px, the menu occupies 547..632, and nothing is cut.

The budget now measures from the edge Floating UI holds still — the menu's top when it is placed below the field, its bottom when placed above — so shrinking the height never moves that edge and the budget cannot oscillate. The menu's rect was already being read to decide which side it is on, so this is a few lines.

The fallback path is unchanged: before VueDatePicker has rendered the menu there is no menu box to measure, so the field stays the reference and the budget stays generous until the post-render recompute refines it.

Context: after the arrow fix in 3.2.12 the calendar flips above the field when there is no room below, so this budget is no longer what keeps HD-25540's calendar usable — it is the fallback for the case where _neither_ side has room, which is what happens at the largest accessibility font scales. It matters there, and the arithmetic being right matters whenever it binds.
