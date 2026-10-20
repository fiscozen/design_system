---
"@fiscozen/tooltip": minor
---

`FzTooltip` takes a `truncate` prop: the content stays on one line, cut with an ellipsis when it does not fit, and the tooltip opens only while the content is cut. The trigger takes no tab stop and no `aria-describedby`, since the full content is already in the DOM. In a flex layout, the flex ancestors need `min-w-0` for the content to be cut.
