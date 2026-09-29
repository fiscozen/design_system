---
'@fiscozen/button': minor
---

FzIconButton: add `compact` and the `danger` variant.

`compact` draws a 20×20 control with a 12px glyph whose clickable area still extends to 44×44 past the visible edge, without taking layout space — for a control laid over something small, such as the remove X on an image preview. Keyboard focus draws a ring inside the box that holds 3:1 against the button's fill. Keep the box 12px from any edge that clips overflow, and two compact buttons 24px apart, so the touch area is neither cut nor shared. `invisible` has no background to stay readable over an image, so in compact mode it renders as `secondary` and logs a warning.

`variant="danger"` brings FzButton's red variant to icon buttons, at every size.
