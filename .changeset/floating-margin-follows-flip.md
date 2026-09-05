---
"@fiscozen/composables": patch
---

FzFloating: make a flipped panel's gap and gap class follow the side it actually landed on

The opener-aware vertical correction shipped in 1.1.2 moves a panel to the other side of its opener when it does not fit. What it did not move was the spacing: the gap class is derived from the resolved position, so a `top` panel flipped below its opener kept `mb-4`, leaving the margin on the edge facing away from the opener.

That class is load-bearing, not decorative. The position calculators take the gap from the element's own margin — `bottom*` leaves `y` on the opener's edge and lets `margin-top` shift the fixed element down, `top*` subtracts `margin-bottom` outright — while the correction spaced a flipped panel by `VIEWPORT_MARGIN` instead. So a flipped panel sat 8px from its opener where a natively-placed one on that side sits 16px, and carried a margin that did nothing on a fixed element positioned by `top`.

Both halves now come from the same place:

- the flip is spaced by the gap the requested side declares in its margin class, so a flipped panel is spaced exactly like a native one on that side — above the opener the gap is in the arithmetic, below it `y` sits on the opener's edge and the flipped side's `margin-top` supplies it;
- the correction reports the side it landed on, and the resolved position is mirrored onto it (keeping the alignment: `top-start` becomes `bottom-start`), so the gap class follows.

Only `top*` / `bottom*` placements are affected. `left*` / `right*` sit beside their opener and keep their horizontal gap, so a vertical correction no longer restyles them onto a vertical side.

Two notes for consumers. The resolved position now reports the flipped side, which is the intended reading — a flipped panel _is_ a panel on that side — but code that compared it against the requested `position` prop to detect "no flip happened" will see them differ. And a panel whose gap class has been overridden away now touches its opener when it flips, exactly as it already did when placed natively on that side; the flip no longer supplies a gap of its own.
