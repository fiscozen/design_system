---
"@fiscozen/storybook": patch
---

Tooltip stories: give the `top` placement room to be tested, and cover the flip explicitly

`Tooltip Top Position` asserted that a `position="top"` tooltip sits above its trigger, unconditionally. With only the canvas padding above it the trigger sits ~40px from the top, where a tooltip plus its gap does not fit, so the opener-aware correction flips it below — and the story failed on main, blocking the pre-push hook for everyone.

The story now leaves 160px above the trigger, so the requested placement is actually reachable and the assertion describes what it claims to. A companion story, `TooltipTopPositionNoRoomAbove`, covers the mirror case: no room above, so the tooltip flips below and carries the gap class of the side it landed on.
