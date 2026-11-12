---
'@fiscozen/input': minor
'@fiscozen/select': minor
---

`FzInput` and `FzSelect` take a `labelAside` prop: a short text on the right of the label row, in a smaller size, such as a computed value next to a value typed by hand. The field announces it as its description. With `truncateLabel` the label is cut first, down to about twelve characters, and only then the aside; each cut text shows in full in a tooltip on hover and while the field has focus. Without `truncateLabel` the label wraps and the aside stays on its first line. `FzDatepicker` receives it through `inputProps`.

New `FzInputLabel` component in `@fiscozen/input`: the label row both fields render, with the required asterisk, `truncate` and `aside`. An `aside` requires an `asideId`, so the control can reference it.

`@fiscozen/select` no longer depends on `@fiscozen/tooltip` directly: it renders the label through `FzInputLabel`.
