---
"@fiscozen/composables": patch
---

`useFloating` stops spending the content's margin twice on the `right` positions (LIB-3055).

`right`, `right-start` and `right-end` anchored the content at `opener.right + margins.left`.
That value is written to `style.left` of an element that keeps its own `margin-left`, and for
a positioned box with `left` set and `right: auto` the margin already moves the border edge
past it — so the margin applied twice and the gap came out double.

The other nine positions never did this: they subtract the margin on the *alignment* axis,
which is what cancels the layout margin, and leave the *offset* axis to the CSS margin alone.
The right family now follows the same rule and anchors at `opener.right`.

Every right-positioned floating moves closer to its opener by its own margin. With the
default `ml-4` that is 4px; a consumer that asks for a wider gap gets the gap it asked for
instead of twice it.

The position tests only asserted that the coordinates were numbers, so nothing could have
caught this. They now assert the exact anchor for each of the three.
