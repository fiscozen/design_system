---
"@fiscozen/tooltip": minor
---

`FzTooltip` takes a `truncate` prop: the content stays on one line, cut with an ellipsis when it does not fit, and the tooltip opens only while the content is cut. The trigger takes no tab stop and no `aria-describedby`, since the full content is already in the DOM. In a flex layout, the flex ancestors need `min-w-0` for the content to be cut.

`FzTooltip` takes an `externalFocus` prop: while focus sits on an element the trigger stands for but does not contain, such as the control a label names, the tooltip behaves as if the trigger had focus, and Escape pressed anywhere hides it.

New `FzTruncatedLabel` component: a field label kept on one line, with the full text in a tooltip on hover and while the labelled control has focus. `FzInput`, `FzSelect` and `FzTextarea` render it with `truncateLabel`.
