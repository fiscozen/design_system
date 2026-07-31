---
"@fiscozen/composables": patch
---

FzFloating: stop the vertical viewport correction from detaching the panel from its opener

The boundary correction added in 1.1.1 shifted a floating panel up whenever it would overflow the bottom of the viewport. That is the wrong move for a panel anchored to an opener, and it produced two visible defects — reported as action lists opening at the top of the page instead of next to their button:

* a panel slightly too tall was slid up **across its own opener**, covering the control that opened it;
* a panel taller than the viewport was pinned to the 8px top margin, i.e. arbitrarily far from its opener — 760px away at a 412x792 viewport with the opener near the bottom.

It bites hardest on placements that never flip: `FzDropdown` resolves its `align` prop to an explicit `bottom` / `bottom-start` / `bottom-end` position, and auto-position resolution only runs for `auto*` placements, so this correction is the only vertical adjustment a dropdown ever receives.

The vertical correction is now opener-aware:

* if the panel would overflow the bottom and fits on the other side of the opener, it **flips above** it (and the mirror case for `top*` placements overflowing the top);
* if it fits nowhere else but fits in the viewport, it is clamped as before;
* if it is taller than the available space, the anchored position is kept — clamping cannot reveal more of it and only breaks the association with the opener.

The horizontal correction is deliberately unchanged: a panel shifted sideways stays on the opener's row and still reads as belonging to it, and clamping a too-wide panel to the left margin does bring its content on screen. Neither of those holds vertically.

Note for consumers: a panel taller than the visible space is now cropped at the bottom instead of being moved to the top of the screen. Capping the panel height with internal scrolling is tracked separately.
